/* eslint-disable max-len */
import { SupportedLanguage } from "@f-budget/f-budget-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

export const ReceiptErrors = {
  notFound: {
    uuid: "38547037-5757-432e-b1bd-028ffbb4bbea",
    httpCode: StatusCodes.NOT_FOUND,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "L'objet Receipt est introuvable.",
        },
        {
          language: SupportedLanguage.En,
          text: "Receipt object was not found.",
        },
      ],
    },
  },
  dbNotResponsive: {
    uuid: "fc9d463c-05d9-4c9d-b341-6a09fb725087",
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
    uuid: "8eb05094-3af6-45b2-8231-c18c72d34386",
    httpCode: StatusCodes.BAD_REQUEST,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Impossible de modifier cet objet Receipt. Il est archivé.'",
        },
        {
          language: SupportedLanguage.En,
          text: "Impossible to edit that Receipt object. It is archived.",
        },
      ],
    },
  },
  repoCreate: {
    uuid: "4681731b-a87d-4e6a-b7a1-af467f576004",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la création de l'objet Receipt.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to create an Receipt object.",
        },
      ],
    },
  },
  repoCreateMany: {
    uuid: "285d67bc-79c0-45be-8be7-edbb124dc92e",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la création de plusieurs objets Receipt.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to create many Receipt objects.",
        },
      ],
    },
  },
  repoSearch: {
    uuid: "4460222b-b097-4104-802c-37ec0d790922",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la recherche d'objets Receipt.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to search Receipt objects.",
        },
      ],
    },
  },
  repoGetAll: {
    uuid: "af88c81c-491f-4216-b909-f9010bd11e32",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la demande de tous les objets Receipt.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to get all Receipt objects.",
        },
      ],
    },
  },
  repoGetById: {
    uuid: "0b9121b3-364b-447f-9894-b819d325a7a9",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la demande d'un objet Receipt.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to get an Receipt object.",
        },
      ],
    },
  },
  repoPatch: {
    uuid: "276225e4-e2b3-43ad-9f8e-b8a1b7c7bae7",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la mise à jour partielle d'un objet Receipt.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to patch an Receipt object.",
        },
      ],
    },
  },
  repoUpdate: {
    uuid: "fa1b9781-2dcf-47e9-9392-ba28d3efd39c",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la mise à jour d'un objet Receipt.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to update an Receipt object.",
        },
      ],
    },
  },
  repoArchive: {
    uuid: "ebd3da85-ad8e-4b2e-b4aa-62a4acc41dfd",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de l'archivage d'un objet Receipt.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to archive an Receipt object.",
        },
      ],
    },
  },
  balanceError: {
    uuid: "ce9cc31c-52d9-4d1d-a0b7-72e124650d2d",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "L'utilisateur n'a pas de Balance.",
        },
        {
          language: SupportedLanguage.En,
          text: "The user does not have a Balance.",
        },
      ],
    },
  },
};
