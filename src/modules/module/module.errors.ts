/* eslint-disable max-len */
import { SupportedLanguage } from "@yest/yest-stats-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

export const ModuleErrors = {
  notFound: {
    uuid: "48e048b4-c6f7-4d75-b763-515a04378e2b",
    httpCode: StatusCodes.NOT_FOUND,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "L'objet Module est introuvable.",
        },
        {
          language: SupportedLanguage.En,
          text: "Module object was not found.",
        },
      ],
    },
  },
  dbNotResponsive: {
    uuid: "a6b05351-dd5c-4782-8f38-9517f060ff6b",
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
    uuid: "13087caa-dfc8-4080-9fe2-31fcb96437db",
    httpCode: StatusCodes.BAD_REQUEST,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Impossible de modifier cet objet Module. Il est archivé.'",
        },
        {
          language: SupportedLanguage.En,
          text: "Impossible to edit that Module object. It is archived.",
        },
      ],
    },
  },
  repoCreate: {
    uuid: "0d5f749e-0e47-4356-95db-3fd8bb619169",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la création de l'objet Module.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to create an Module object.",
        },
      ],
    },
  },
  repoCreateMany: {
    uuid: "d4aae937-8f1a-45e1-b83f-1be3db5b9884",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la création de plusieurs objets Module.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to create many Module objects.",
        },
      ],
    },
  },
  repoSearch: {
    uuid: "e9abb36f-90b5-41f6-aaf1-7ac316b59ff0",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la recherche d'objets Module.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to search Module objects.",
        },
      ],
    },
  },
  repoGetAll: {
    uuid: "d2554972-54ee-4bd4-848f-5a7719b3dda1",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la demande de tous les objets Module.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to get all Module objects.",
        },
      ],
    },
  },
  repoGetById: {
    uuid: "682941a2-4a74-4cb2-b535-2d273ad52dcf",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la demande d'un objet Module.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to get an Module object.",
        },
      ],
    },
  },
  repoPatch: {
    uuid: "4e691b1f-7cec-42bc-99ea-5b645df73a4a",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la mise à jour partielle d'un objet Module.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to patch an Module object.",
        },
      ],
    },
  },
  repoUpdate: {
    uuid: "69cb6f97-2ccd-4e90-93ae-9d7e005df8ce",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la mise à jour d'un objet Module.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to update an Module object.",
        },
      ],
    },
  },
  repoArchive: {
    uuid: "5c2c2b99-a7a4-4222-ac0f-f5f1451063ac",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de l'archivage d'un objet Module.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to archive an Module object.",
        },
      ],
    },
  },
};
