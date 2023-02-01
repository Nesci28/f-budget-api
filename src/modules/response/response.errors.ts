/* eslint-disable max-len */
import { SupportedLanguage } from "@yest/yest-stats-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

export const ResponseErrors = {
  notFound: {
    uuid: "a3bdaf33-bdbc-4f15-ad60-3bd21f837666",
    httpCode: StatusCodes.NOT_FOUND,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "L'objet Response est introuvable.",
        },
        {
          language: SupportedLanguage.En,
          text: "Response object was not found.",
        },
      ],
    },
  },
  dbNotResponsive: {
    uuid: "c8257fe8-fa19-4842-86e1-715029e40864",
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
    uuid: "9ae6d5bf-bc3a-4301-9401-89212bdd8ef2",
    httpCode: StatusCodes.BAD_REQUEST,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Impossible de modifier cet objet Response. Il est archivé.'",
        },
        {
          language: SupportedLanguage.En,
          text: "Impossible to edit that Response object. It is archived.",
        },
      ],
    },
  },
  repoCreate: {
    uuid: "806a2169-886c-4338-be5b-ebc7fff329bd",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la création de l'objet Response.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to create an Response object.",
        },
      ],
    },
  },
  repoCreateMany: {
    uuid: "b9878bf1-42ce-4428-a71c-4f2d3416785f",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la création de plusieurs objets Response.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to create many Response objects.",
        },
      ],
    },
  },
  repoSearch: {
    uuid: "4a82d20a-0f1a-490b-923a-9738c6e46899",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la recherche d'objets Response.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to search Response objects.",
        },
      ],
    },
  },
  repoGetAll: {
    uuid: "f3e93111-0674-4b9a-8b3d-270ec4e73bb8",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la demande de tous les objets Response.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to get all Response objects.",
        },
      ],
    },
  },
  repoGetById: {
    uuid: "020a9d95-3181-47a0-9443-a54f0123e0cc",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la demande d'un objet Response.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to get an Response object.",
        },
      ],
    },
  },
  repoPatch: {
    uuid: "17c9a1ab-73fb-49e8-81e8-ee9cf97f33e4",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la mise à jour partielle d'un objet Response.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to patch an Response object.",
        },
      ],
    },
  },
  repoUpdate: {
    uuid: "d16bac3b-138d-4af3-a12f-099de7668035",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la mise à jour d'un objet Response.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to update an Response object.",
        },
      ],
    },
  },
  repoArchive: {
    uuid: "488decd8-1bb0-4e8b-b440-55547ce8ba38",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de l'archivage d'un objet Response.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to archive an Response object.",
        },
      ],
    },
  },
};
