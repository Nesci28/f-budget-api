/* eslint-disable max-len */
import { SupportedLanguage } from "@yest/yest-stats-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

export const RequestErrors = {
  notFound: {
    uuid: "ffe93642-fa99-4847-bc26-51ad1de945c5",
    httpCode: StatusCodes.NOT_FOUND,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "L'objet Request est introuvable.",
        },
        {
          language: SupportedLanguage.En,
          text: "Request object was not found.",
        },
      ],
    },
  },
  dbNotResponsive: {
    uuid: "c8aedc30-b64a-4012-a768-1b0ab119d317",
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
    uuid: "c68fcbea-1408-44cf-9c2a-78a5f88698d5",
    httpCode: StatusCodes.BAD_REQUEST,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Impossible de modifier cet objet Request. Il est archivé.'",
        },
        {
          language: SupportedLanguage.En,
          text: "Impossible to edit that Request object. It is archived.",
        },
      ],
    },
  },
  repoCreate: {
    uuid: "e6a92f95-0f79-4c38-ab34-c17bba4adfeb",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la création de l'objet Request.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to create an Request object.",
        },
      ],
    },
  },
  repoCreateMany: {
    uuid: "620ef3da-8ef7-49cd-b172-498604a001ff",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la création de plusieurs objets Request.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to create many Request objects.",
        },
      ],
    },
  },
  repoSearch: {
    uuid: "78cd7702-90ef-49b6-a474-c7c96bb4f9e3",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la recherche d'objets Request.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to search Request objects.",
        },
      ],
    },
  },
  repoGetAll: {
    uuid: "cae0aa51-f239-4cd1-a85c-648b2d6c8feb",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la demande de tous les objets Request.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to get all Request objects.",
        },
      ],
    },
  },
  repoGetById: {
    uuid: "40a15e7f-f1a0-402f-b32c-d56f321ebf3f",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la demande d'un objet Request.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to get an Request object.",
        },
      ],
    },
  },
  repoPatch: {
    uuid: "ca65e744-c9fd-4d59-b201-0dcdaf73176a",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la mise à jour partielle d'un objet Request.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to patch an Request object.",
        },
      ],
    },
  },
  repoUpdate: {
    uuid: "bcfc9403-3cc4-4a5b-b694-064005a61e29",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la mise à jour d'un objet Request.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to update an Request object.",
        },
      ],
    },
  },
  repoArchive: {
    uuid: "d02d92a7-cc45-480d-8c51-241358f0ff0f",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de l'archivage d'un objet Request.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to archive an Request object.",
        },
      ],
    },
  },
};
