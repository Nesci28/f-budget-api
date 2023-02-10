/* eslint-disable max-len */
import { SupportedLanguage } from "@f-budget/f-budget-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

export const UploadErrors = {
  notFound: {
    uuid: "088c5d64-67a4-46e1-aa57-5f8e8c0478c7",
    httpCode: StatusCodes.NOT_FOUND,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "L'objet Upload est introuvable.",
        },
        {
          language: SupportedLanguage.En,
          text: "Upload object was not found.",
        },
      ],
    },
  },
  dbNotResponsive: {
    uuid: "5a00faba-3342-4bfa-893e-17b8f7a653e4",
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
    uuid: "29ca2e98-d07b-4681-80b0-ebcadb99d14a",
    httpCode: StatusCodes.BAD_REQUEST,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Impossible de modifier cet objet Upload. Il est archivé.'",
        },
        {
          language: SupportedLanguage.En,
          text: "Impossible to edit that Upload object. It is archived.",
        },
      ],
    },
  },
  repoCreate: {
    uuid: "2b7d3fe7-a0c1-44d1-b25f-906e67a21cce",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la création de l'objet Upload.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to create an Upload object.",
        },
      ],
    },
  },
  repoCreateMany: {
    uuid: "0b05072d-9bb2-417c-8428-f26f899de5ac",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la création de plusieurs objets Upload.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to create many Upload objects.",
        },
      ],
    },
  },
  repoSearch: {
    uuid: "f8bc3afb-d6a3-43d4-b843-f0189d40dc78",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la recherche d'objets Upload.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to search Upload objects.",
        },
      ],
    },
  },
  repoGetAll: {
    uuid: "a45c6f26-b43b-4e2a-8d69-47885a98c6d9",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la demande de tous les objets Upload.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to get all Upload objects.",
        },
      ],
    },
  },
  repoGetById: {
    uuid: "64fc4a92-b90b-4a68-b9a3-3db1ec3a1baf",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la demande d'un objet Upload.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to get an Upload object.",
        },
      ],
    },
  },
  repoPatch: {
    uuid: "aa353e11-a00b-47f6-898a-82686a96cd09",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la mise à jour partielle d'un objet Upload.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to patch an Upload object.",
        },
      ],
    },
  },
  repoUpdate: {
    uuid: "29bf9da1-c09c-487c-afcb-24a069de4631",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la mise à jour d'un objet Upload.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to update an Upload object.",
        },
      ],
    },
  },
  repoArchive: {
    uuid: "cb9747c9-8432-4109-987b-c8232e15bb7a",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de l'archivage d'un objet Upload.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to archive an Upload object.",
        },
      ],
    },
  },
};
