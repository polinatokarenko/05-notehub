/*css*/
import css from "./NoteForm.module.css";

/*form*/
import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";

/*hooks*/
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";

/*services*/
import { createNote } from "../../services/noteService";

/*types*/
import type { CreateNoteProps } from "../../services/noteService";


interface NoteFormProps {
    onClose: () => void;
}

type FormValues = {
  title: string;
  content: string ;
  tag: string;
};

export default function NoteForm({ onClose }: NoteFormProps) {
    const fieldId = useId();
    const initialValues = {
        title: "",
        content: "",
        tag: "Todo"
    }

    const queryClient = useQueryClient();

    const mutation = useMutation({
    mutationFn: (data: CreateNoteProps) => createNote(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            onClose();
        },
        onError: (err) => {
            console.error("Create note error:", err);
        },
    });

    const handleSubmit = async (values: FormValues, { setSubmitting, resetForm }: FormikHelpers<FormValues>) => {
    try {
        setSubmitting(true);
        const payload: CreateNoteProps = {
            title: values.title,
            content: values.content,
            tag: values.tag,
        };
        await mutation.mutateAsync(payload);
        resetForm();
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

    const Schema = Yup.object().shape({
        title: Yup.string()
            .min(3, "Title must be at least 3 characters")
            .max(50, "Title is too long")
            .required("Title is required!"),
        content: Yup.string()
            .max(500, "Content is too long"),
        tag: Yup.string()
            .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"], "Invalid tag")
            .required("Tag is required"),
    });

    return (
        <Formik<FormValues> initialValues={initialValues} onSubmit={handleSubmit} validationSchema={Schema}>
            <Form className={css.form}>
                <div className={css.formGroup}>
                    <label htmlFor={`${fieldId}-title`}>Title</label>
                    <Field id={`${fieldId}-title`} name="title" type="text" className={css.input} />
                    <ErrorMessage component="span" name="title" className={css.error} />
                </div>
                <div className={css.formGroup}>
                    <label htmlFor={`${fieldId}-content`}>Content</label>
                    <Field as="textarea" id={`${fieldId}-content`} name="content" rows={8} className={css.textarea} />
                    <ErrorMessage component="span" name="content" className={css.error} />
                </div>
                <div className={css.formGroup}>
                    <label htmlFor={`${fieldId}-tag`}>Tag</label>
                    <Field as="select" id={`${fieldId}-tag`} name="tag" className={css.select}>
                        <option value="Todo">Todo</option>
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Shopping">Shopping</option>
                    </Field>
                    <ErrorMessage component="span" name="tag" className={css.error} />
                </div>

        <div className={css.actions}>
          <button onClick={() => onClose()} type="button" className={css.cancelButton}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
    )
}