/* eslint-disable max-len */
import { SupportedLanguage } from "@f-budget/f-budget-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

export const RenewErrors = {
  notFound: {
    uuid: "ff5c1201-0383-4614-ab3c-8dd75ccd1943",
    httpCode: StatusCodes.NOT_FOUND,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "L'objet Renew est introuvable.",
        },
        { language: SupportedLanguage.En, text: "Renew object was not found." },
      ],
    },
  },
  dbNotResponsive: {
    uuid: "75fa79c4-9469-4d34-a022-b67559f0947c",
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
    uuid: "6b1a3481-2124-41cb-89b0-75b5250aae40",
    httpCode: StatusCodes.BAD_REQUEST,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Impossible de modifier cet objet Renew. Il est archivé.'",
        },
        {
          language: SupportedLanguage.En,
          text: "Impossible to edit that Renew object. It is archived.",
        },
      ],
    },
  },
  repoCreate: {
    uuid: "55212696-a323-448e-9ec4-d9516f4168e1",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la création de l'objet Renew.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to create an Renew object.",
        },
      ],
    },
  },
  repoCreateMany: {
    uuid: "db100a5c-2aa3-4150-8b40-afe31ff89c9b",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la création de plusieurs objets Renew.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to create many Renew objects.",
        },
      ],
    },
  },
  repoSearch: {
    uuid: "92fdf262-cbab-4a1c-9d3e-980d0cbbe02b",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la recherche d'objets Renew.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to search Renew objects.",
        },
      ],
    },
  },
  repoGetAll: {
    uuid: "317da589-1530-4bef-aa32-7cbfc9ed0597",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la demande de tous les objets Renew.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to get all Renew objects.",
        },
      ],
    },
  },
  repoGetById: {
    uuid: "106fc4ba-544e-4a0d-bbce-a5a9a5ba918d",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la demande d'un objet Renew.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to get an Renew object.",
        },
      ],
    },
  },
  repoPatch: {
    uuid: "8c88125c-7ad9-4bda-8548-203bfad68a55",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la mise à jour partielle d'un objet Renew.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to patch an Renew object.",
        },
      ],
    },
  },
  repoUpdate: {
    uuid: "cbc4c2cb-1c95-4b37-abcf-39d8517a7ffd",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la mise à jour d'un objet Renew.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to update an Renew object.",
        },
      ],
    },
  },
  repoArchive: {
    uuid: "820efe0c-5832-4367-87e7-2d75e2b1fe89",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de l'archivage d'un objet Renew.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to archive an Renew object.",
        },
      ],
    },
  },
};
