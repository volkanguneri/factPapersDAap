"use client";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

// Wagmi

// Dotenv
require("dotenv").config({});

// import { StyledForm } from "@/components/Articles/Articles";

const ArticleSchema = Yup.object().shape({
  title: Yup.string().required("Le titre est requis"),
  image: Yup.mixed().required("Une image est requise"),
  text: Yup.string().required("Le texte est requis"),
});
const Articles = () => {
  return (
    <Formik
      initialValues={{ title: "", image: "" }}
      validationSchema={ArticleSchema}
      onSubmit={(values, { setSubmitting }) => {
        // FAUT QUE je recupère ces données là ici pour envoyer à ipfs
        console.log(values);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <label htmlFor="title">Titre </label>
          <Field type="text" id="title" name="title" />
          <ErrorMessage name="title" component="div" />
          <label htmlFor="image">Image </label>
          <Field type="file" id="image" name="image" />
          <ErrorMessage name="image" component="div" />
          <Field
            as="textarea"
            id="text"
            name="text"
            style={{ width: "80%", height: "200px" }}
          />
          <button type="submit" disabled={isSubmitting}>
            Soumettre
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default Articles;
