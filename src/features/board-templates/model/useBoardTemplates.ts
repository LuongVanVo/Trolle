import type { ApiError } from "@/shared/api/fetchFactory";
import type { GetAllBoardTemplatesResponse } from "../api/type";
import { boardTemplateApi } from "../api/boardTemplateApi";

export const useBoardTemplates = () => {
  // get all board templates
  const getAllBoardTemplates =
    async (): Promise<GetAllBoardTemplatesResponse> => {
      try {
        const data = await boardTemplateApi.getAllBoardTemplates();
        if (!data) throw new Error("Failed to get all board templates");
        return data;
      } catch (err) {
        const apiError = err as ApiError;
        alert(apiError.message);
        return {
          boards: [],
          lists: [],
          cards: [],
        };
      }
    };

  return {
    getAllBoardTemplates,
  };
};
