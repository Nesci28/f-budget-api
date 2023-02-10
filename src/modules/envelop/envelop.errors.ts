/* eslint-disable max-len */
import { SupportedLanguage } from "@f-budget/f-budget-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

export const EnvelopErrors = {
  notFound: {
    uuid: "d5d45fb4-eb64-4671-9f6c-673ee7b169c9",
    httpCode: StatusCodes.NOT_FOUND,
    message: {
      translation: [
        { language: SupportedLanguage.Fr, text: "L'objet Envelop est introuvable." },
        { language: SupportedLanguage.En, text: "Envelop object was not found." },
      ],
    },
  },
  dbNotResponsive: {
    uuid: "817cb028-f6d8-4c68-86fb-6462e5225569",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Le base de donnée n'a pas été en mesure de traiter la demande.",
        },
        { language: SupportedLanguage.En, text: "Database server was unable to respond." },
      ],
    },
  },
  alreadyArchived: {
    uuid: "0b4968f4-f787-4b9c-bff9-89dbc94349db",
    httpCode: StatusCodes.BAD_REQUEST,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Impossible de modifier cet objet Envelop. Il est archivé.'",
        },
        {
          language: SupportedLanguage.En,
          text: "Impossible to edit that Envelop object. It is archived.",
        },
      ],
    },
  },
  repoCreate: {
    uuid: "72a59ebf-cf8b-4beb-a4f8-a1be7410e0b9",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la création de l'objet Envelop.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to create an Envelop object.",
        },
      ],
    },
  },
  repoCreateMany: {
    uuid: "3c74abcf-d97d-4578-a06f-8cef48ca6f04",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la création de plusieurs objets Envelop.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to create many Envelop objects.",
        },
      ],
    },
  },
  repoSearch: {
    uuid: "779d8120-6780-4f80-a1cd-019b90dae03b",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la recherche d'objets Envelop.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to search Envelop objects.",
        },
      ],
    },
  },
  repoGetAll: {
    uuid: "292bce70-0932-475c-a086-4da8221fefc1",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la demande de tous les objets Envelop.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to get all Envelop objects.",
        },
      ],
    },
  },
  repoGetById: {
    uuid: "d63c746c-0fb7-4055-834b-33fa9eccae6a",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la demande d'un objet Envelop.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to get an Envelop object.",
        },
      ],
    },
  },
  repoPatch: {
    uuid: "3eb5d49c-685c-44c3-b9c7-c6f3db13cc65",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la mise à jour partielle d'un objet Envelop.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to patch an Envelop object.",
        },
      ],
    },
  },
  repoUpdate: {
    uuid: "599b0b32-b74e-49c4-8f05-c788ebee493e",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la mise à jour d'un objet Envelop.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to update an Envelop object.",
        },
      ],
    },
  },
  repoArchive: {
    uuid: "bb6e9da2-56f5-46b8-96bf-0ddf15c20f51",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de l'archivage d'un objet Envelop.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to archive an Envelop object.",
        },
      ],
    },
  },
};
