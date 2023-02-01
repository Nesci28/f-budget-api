/* eslint-disable max-len */
import { SupportedLanguage } from "@yest/yest-stats-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

export const EndpointErrors = {
  notFound: {
    uuid: "67bac54a-b1b7-401c-a2da-43bfc9f90a27",
    httpCode: StatusCodes.NOT_FOUND,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "L'objet Endpoint est introuvable.",
        },
        {
          language: SupportedLanguage.En,
          text: "Endpoint object was not found.",
        },
      ],
    },
  },
  dbNotResponsive: {
    uuid: "80074553-fffe-4baa-9569-09a66dbe3597",
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
    uuid: "0d7ecf1f-1f94-400d-ac7a-0755ac278b93",
    httpCode: StatusCodes.BAD_REQUEST,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Impossible de modifier cet objet Endpoint. Il est archivé.'",
        },
        {
          language: SupportedLanguage.En,
          text: "Impossible to edit that Endpoint object. It is archived.",
        },
      ],
    },
  },
  repoCreate: {
    uuid: "07b5b5a1-dc99-4e11-820b-0d3cf9f8513a",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la création de l'objet Endpoint.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to create an Endpoint object.",
        },
      ],
    },
  },
  repoCreateMany: {
    uuid: "197d59a4-6c5a-495e-9efd-af839bee1821",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la création de plusieurs objets Endpoint.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to create many Endpoint objects.",
        },
      ],
    },
  },
  repoSearch: {
    uuid: "32c30b20-36f3-4883-9b26-49905331b64e",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la recherche d'objets Endpoint.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to search Endpoint objects.",
        },
      ],
    },
  },
  repoGetAll: {
    uuid: "8de96709-7cd5-4321-ae85-42b88e2127ab",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la demande de tous les objets Endpoint.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to get all Endpoint objects.",
        },
      ],
    },
  },
  repoGetById: {
    uuid: "a47453fa-8dd4-4fec-a116-d30cace10650",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la demande d'un objet Endpoint.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to get an Endpoint object.",
        },
      ],
    },
  },
  repoPatch: {
    uuid: "2c5361bd-cb39-48d3-995f-031d4a3f257e",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la mise à jour partielle d'un objet Endpoint.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to patch an Endpoint object.",
        },
      ],
    },
  },
  repoUpdate: {
    uuid: "9b15e1f3-a13d-4e12-8abd-a4a0488e056d",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la mise à jour d'un objet Endpoint.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to update an Endpoint object.",
        },
      ],
    },
  },
  repoArchive: {
    uuid: "a29e0ec9-ed00-4a1a-b7f2-6dce2462f773",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de l'archivage d'un objet Endpoint.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to archive an Endpoint object.",
        },
      ],
    },
  },
};
