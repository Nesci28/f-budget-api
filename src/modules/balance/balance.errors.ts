/* eslint-disable max-len */
import { SupportedLanguage } from "@f-budget/f-budget-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

export const BalanceErrors = {
  notFound: {
    uuid: "ce53d2f5-68b5-49c6-a4f1-95559658c818",
    httpCode: StatusCodes.NOT_FOUND,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "L'objet Balance est introuvable.",
        },
        {
          language: SupportedLanguage.En,
          text: "Balance object was not found.",
        },
      ],
    },
  },
  dbNotResponsive: {
    uuid: "3134c39b-a437-46c1-8aca-ec504f8cbf0b",
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
    uuid: "267e0d6a-65d5-4a13-9ae8-01a7ff3e3ba7",
    httpCode: StatusCodes.BAD_REQUEST,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Impossible de modifier cet objet Balance. Il est archivé.'",
        },
        {
          language: SupportedLanguage.En,
          text: "Impossible to edit that Balance object. It is archived.",
        },
      ],
    },
  },
  repoCreate: {
    uuid: "23fd9a81-9d02-401d-b511-437f85e97a91",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la création de l'objet Balance.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to create an Balance object.",
        },
      ],
    },
  },
  repoCreateMany: {
    uuid: "a2425bde-dbfa-4c3d-b5fc-4892cbaa091c",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la création de plusieurs objets Balance.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to create many Balance objects.",
        },
      ],
    },
  },
  repoSearch: {
    uuid: "f0fce883-a1ee-49af-b7cd-7f33cb992655",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la recherche d'objets Balance.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to search Balance objects.",
        },
      ],
    },
  },
  repoGetAll: {
    uuid: "a72cc115-e918-46aa-a77f-31ec6deb242b",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la demande de tous les objets Balance.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to get all Balance objects.",
        },
      ],
    },
  },
  repoGetById: {
    uuid: "dc6688b7-8c5a-4cb8-a559-2833d12bb2da",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la demande d'un objet Balance.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to get an Balance object.",
        },
      ],
    },
  },
  repoPatch: {
    uuid: "385a0cc8-265a-4269-852c-4f1fa550b205",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la mise à jour partielle d'un objet Balance.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to patch an Balance object.",
        },
      ],
    },
  },
  repoUpdate: {
    uuid: "06abb3c5-01c5-4c88-adf9-118d8e0575dc",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la mise à jour d'un objet Balance.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to update an Balance object.",
        },
      ],
    },
  },
  repoArchive: {
    uuid: "86a548ed-9e18-4b84-a403-5a6876cc2ee1",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de l'archivage d'un objet Balance.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to archive an Balance object.",
        },
      ],
    },
  },
};
