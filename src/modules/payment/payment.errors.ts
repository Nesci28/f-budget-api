/* eslint-disable max-len */
import { SupportedLanguage } from "@f-budget/f-budget-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

export const PaymentErrors = {
  notFound: {
    uuid: "13b88935-f19b-481f-9aaa-e139256b0fe9",
    httpCode: StatusCodes.NOT_FOUND,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "L'objet Payment est introuvable.",
        },
        {
          language: SupportedLanguage.En,
          text: "Payment object was not found.",
        },
      ],
    },
  },
  dbNotResponsive: {
    uuid: "af05acfb-5bfa-4871-82c2-64875af9bf11",
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
    uuid: "64394427-79ce-448b-81a1-3609a333a260",
    httpCode: StatusCodes.BAD_REQUEST,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Impossible de modifier cet objet Payment. Il est archivé.'",
        },
        {
          language: SupportedLanguage.En,
          text: "Impossible to edit that Payment object. It is archived.",
        },
      ],
    },
  },
  repoCreate: {
    uuid: "ca5fda17-8849-4f20-ae10-8ed45655d370",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la création de l'objet Payment.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to create an Payment object.",
        },
      ],
    },
  },
  repoCreateMany: {
    uuid: "39beecc0-4399-43c6-b776-9b08b1c60aa3",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la création de plusieurs objets Payment.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to create many Payment objects.",
        },
      ],
    },
  },
  repoSearch: {
    uuid: "8fd9c33b-1fa7-4b96-9473-713e7891cc8b",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la recherche d'objets Payment.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to search Payment objects.",
        },
      ],
    },
  },
  repoGetAll: {
    uuid: "832a33b9-bd4f-4ff2-b532-e37c1f767cd9",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la demande de tous les objets Payment.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to get all Payment objects.",
        },
      ],
    },
  },
  repoGetById: {
    uuid: "9eeeee72-d25b-40ee-ab5b-e83d38b3fe84",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la demande d'un objet Payment.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to get an Payment object.",
        },
      ],
    },
  },
  repoPatch: {
    uuid: "83e1be16-c815-49b6-8e95-5862377bbb8f",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la mise à jour partielle d'un objet Payment.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to patch an Payment object.",
        },
      ],
    },
  },
  repoUpdate: {
    uuid: "9df802b6-e92e-4777-8ca7-f21fb589f07b",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la mise à jour d'un objet Payment.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to update an Payment object.",
        },
      ],
    },
  },
  repoArchive: {
    uuid: "949542bb-67df-47e5-bbfa-68454b5f55d7",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de l'archivage d'un objet Payment.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to archive an Payment object.",
        },
      ],
    },
  },
};
