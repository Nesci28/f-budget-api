/* eslint-disable max-len */
import { SupportedLanguage } from "@yest/yest-stats-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

export const UserErrors = {
  notFound: {
    uuid: "e56121b4-7b99-4448-8912-65eadbf09dcc",
    httpCode: StatusCodes.NOT_FOUND,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "L'objet User est introuvable.",
        },
        { language: SupportedLanguage.En, text: "User object was not found." },
      ],
    },
  },
  dbNotResponsive: {
    uuid: "2b379691-15bb-4ffb-884b-5872bbdabc11",
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
    uuid: "11f67f79-75f5-46f8-b8cc-3acfe7dd0fc3",
    httpCode: StatusCodes.BAD_REQUEST,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Impossible de modifier cet objet User. Il est archivé.'",
        },
        {
          language: SupportedLanguage.En,
          text: "Impossible to edit that User object. It is archived.",
        },
      ],
    },
  },
  repoCreate: {
    uuid: "6138883e-1b98-4822-ae63-dd50e50172f9",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la création de l'objet User.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to create an User object.",
        },
      ],
    },
  },
  repoCreateMany: {
    uuid: "f2c21d30-8244-474a-adcf-c77bb869f65c",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la création de plusieurs objets User.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to create many User objects.",
        },
      ],
    },
  },
  repoSearch: {
    uuid: "d97b9cc9-0d6c-44ce-a5b7-b045066f63df",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la recherche d'objets User.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to search User objects.",
        },
      ],
    },
  },
  repoGetAll: {
    uuid: "937fef72-c879-4490-962b-3aa54e5c9c6f",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la demande de tous les objets User.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to get all User objects.",
        },
      ],
    },
  },
  repoGetById: {
    uuid: "9e7a2170-4fa6-4695-9a88-08901cd86c95",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la demande d'un objet User.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to get an User object.",
        },
      ],
    },
  },
  repoPatch: {
    uuid: "c4a17dfb-52b9-4ef6-a462-b8b96bfacbf7",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la mise à jour partielle d'un objet User.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to patch an User object.",
        },
      ],
    },
  },
  repoUpdate: {
    uuid: "97641b99-71d5-40a2-ad1e-d08f0d59da2b",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la mise à jour d'un objet User.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to update an User object.",
        },
      ],
    },
  },
  repoArchive: {
    uuid: "b3083993-8589-41b3-a77b-f1fb9b6b7fef",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de l'archivage d'un objet User.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to archive an User object.",
        },
      ],
    },
  },
};
