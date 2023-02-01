/* eslint-disable max-len */
import { SupportedLanguage } from "@yest/yest-stats-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

export const ProjectErrors = {
  notFound: {
    uuid: "1ba99e42-dd66-4d54-9991-4a80287cf83b",
    httpCode: StatusCodes.NOT_FOUND,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "L'objet Project est introuvable.",
        },
        {
          language: SupportedLanguage.En,
          text: "Project object was not found.",
        },
      ],
    },
  },
  dbNotResponsive: {
    uuid: "763dd3ca-493a-4620-b593-fc569c2ecd4a",
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
    uuid: "99120b75-77bc-4717-ac3e-db21a71b79e7",
    httpCode: StatusCodes.BAD_REQUEST,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Impossible de modifier cet objet Project. Il est archivé.'",
        },
        {
          language: SupportedLanguage.En,
          text: "Impossible to edit that Project object. It is archived.",
        },
      ],
    },
  },
  repoCreate: {
    uuid: "ecaa00d6-514d-4f07-8ac0-7270546600de",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la création de l'objet Project.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to create an Project object.",
        },
      ],
    },
  },
  repoCreateMany: {
    uuid: "fb133054-f81f-42e3-a833-8f5b7f4409b3",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la création de plusieurs objets Project.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to create many Project objects.",
        },
      ],
    },
  },
  repoSearch: {
    uuid: "4969a51e-8bf9-4bfc-b53e-3a443ddead6b",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la recherche d'objets Project.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to search Project objects.",
        },
      ],
    },
  },
  repoGetAll: {
    uuid: "d9940d75-7acd-47b1-9e5a-67b712acbaf2",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la demande de tous les objets Project.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to get all Project objects.",
        },
      ],
    },
  },
  repoGetById: {
    uuid: "322acbea-3c04-4ad8-9df8-634462ddc899",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la demande d'un objet Project.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to get an Project object.",
        },
      ],
    },
  },
  repoPatch: {
    uuid: "1acf47f0-599c-460b-8e58-359373172383",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la mise à jour partielle d'un objet Project.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to patch an Project object.",
        },
      ],
    },
  },
  repoUpdate: {
    uuid: "591c3a4c-4d07-49d0-9514-6159b954c493",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la mise à jour d'un objet Project.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to update an Project object.",
        },
      ],
    },
  },
  repoArchive: {
    uuid: "12384041-39fb-4fa8-b6e7-38db43c30600",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de l'archivage d'un objet Project.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to archive an Project object.",
        },
      ],
    },
  },
};
