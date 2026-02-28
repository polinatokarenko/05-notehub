import { Formik, Form, Field } from "formik";
import { useId } from "react";
import * as Yup from "yup";
import css from "./NoteForm.module.css";
import { createNote } from "../../services/noteService";
import type { CreateNoteProps } from "../../services/noteService";



export default function NoteForm() {
    const fieldId = useId();
    const initialValues = {
        title: "",
        content: "",
        tag: "Todo"
    }
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

    const handleSubmit = (data: CreateNoteProps) => {
        createNote(data);
    };

    return (
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={Schema}>
            <Form className={css.form}>
                <div className={css.formGroup}>
                    <label htmlFor={`${fieldId}-title`}>Title</label>
                    <Field id={`${fieldId}-title`} name="title" type="text" className={css.input} />
                    <span className={css.error} />
                </div>
                <div className={css.formGroup}>
                    <label htmlFor={`${fieldId}-content`}>Content</label>
                    <Field as="textarea" id={`${fieldId}-content`} name="content" type="text" rows={8} className={css.textarea} />
                    <span className={css.error} />
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
                    <span className={css.error} />
                </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton}>
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