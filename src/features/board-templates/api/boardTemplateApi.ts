import { fetchFactory } from "@/shared/api";
import type { ApiResponse, GetAllBoardTemplatesResponse } from "./type";
import { BoardTemplateEndpoint } from "@/shared/api/endpoints";

export const boardTemplateApi = {
  getAllBoardTemplates: async (): Promise<GetAllBoardTemplatesResponse> => {
    const response = await fetchFactory.get<
      ApiResponse<GetAllBoardTemplatesResponse>
    >(BoardTemplateEndpoint.GET_ALL_BOARD_TEMPLATES);
    const boards = Array.isArray(response.data) ? response.data : [];
    return {
      boards,
      lists: [],
      cards: [],
    };
  },
};
