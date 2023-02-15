/* eslint-disable max-len */
import { SupportedLanguage } from "@f-budget/f-budget-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

export const PictureErrors = {
  notFound: {
    uuid: "aeffb4cf-670a-43b0-8b63-ca404845044f",
    httpCode: StatusCodes.NOT_FOUND,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "L'objet Picture est introuvable.",
        },
        {
          language: SupportedLanguage.En,
          text: "Picture object was not found.",
        },
      ],
    },
  },
  dbNotResponsive: {
    uuid: "ad9b5b07-30f4-4eea-9041-830bb8da3955",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Le base de donnée n'a pas été en mesure de traiter la demande.",
        },
        {
          language: SupportedLanguage.En,
          text: "Database server was unable to respond.",
        },
      ],
    },
  },
  alreadyArchived: {
    uuid: "d97beb43-5f75-40fd-8451-4029660cd3db",
    httpCode: StatusCodes.BAD_REQUEST,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Impossible de modifier cet objet Picture. Il est archivé.'",
        },
        {
          language: SupportedLanguage.En,
          text: "Impossible to edit that Picture object. It is archived.",
        },
      ],
    },
  },
  repoCreate: {
    uuid: "66cc3f40-8437-4f81-b821-78310ae1d177",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la création de l'objet Picture.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to create an Picture object.",
        },
      ],
    },
  },
  repoCreateMany: {
    uuid: "b2f1e08d-6e04-40e8-8dbb-faffb98f8582",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la création de plusieurs objets Picture.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to create many Picture objects.",
        },
      ],
    },
  },
  repoSearch: {
    uuid: "8cfc727b-433b-4798-ae50-92658d7fb52b",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la recherche d'objets Picture.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to search Picture objects.",
        },
      ],
    },
  },
  repoGetAll: {
    uuid: "24e4bf93-65d5-4494-aced-6e022a1a5077",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la demande de tous les objets Picture.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to get all Picture objects.",
        },
      ],
    },
  },
  repoGetById: {
    uuid: "6d627f12-e709-4995-b819-10b81a910c64",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la demande d'un objet Picture.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to get an Picture object.",
        },
      ],
    },
  },
  repoPatch: {
    uuid: "c66342d9-a249-4000-82b0-6564de5aae32",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la mise à jour partielle d'un objet Picture.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to patch an Picture object.",
        },
      ],
    },
  },
  repoUpdate: {
    uuid: "7d20ff79-d0da-4596-a9f6-08afc7dae017",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la mise à jour d'un objet Picture.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to update an Picture object.",
        },
      ],
    },
  },
  repoArchive: {
    uuid: "63a1f240-6fa0-4246-822d-72d127e09a7a",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de l'archivage d'un objet Picture.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to archive an Picture object.",
        },
      ],
    },
  },
};
