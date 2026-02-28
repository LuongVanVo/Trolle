import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { FiChevronLeft, FiRefreshCcw, FiTrash2, FiX } from "react-icons/fi";
import { useListContext } from "@/features/providers/ListProvider";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/shared/ui/aleart-dialog";

export interface ArchivedItemsProps {
  onClose: () => void;
}

export function ArchivedItems({ onClose }: ArchivedItemsProps) {
    const { archivedList, fetchAllArchivedListsOfBoard, handleDeleteListFromBoardPermanently, fetchDeleteListFromBoard } = useListContext();
    const { boardId } = useParams();
    const [isRestoring, setIsRestoring] = useState(false);

    useEffect(() => {
        if (boardId) {
            fetchAllArchivedListsOfBoard({ boardId: boardId });
        }
    }, [boardId]);

    // delete list from board permanently
    const deleteListFromBoardPermanently = async (listId: string) => {
        try {
            await handleDeleteListFromBoardPermanently({ boardId: boardId as string, listId: listId });
            if (boardId) {
                await fetchAllArchivedListsOfBoard({ boardId: boardId });
            }
        } catch (err) {
            console.error(`Failed to delete list from board permanently: ${err}`);
            throw err;
        }
    }

    // restore list from board
    const handleRestoreList = async (listId: string) => {
        setIsRestoring(true);
        try {
            await fetchDeleteListFromBoard({ boardId: boardId as string, listId: listId, archived: false });
            if (boardId) {
                await fetchAllArchivedListsOfBoard({ boardId: boardId });
            }
        } catch (err) {
            console.error(`Failed to restore list: ${err}`);
            throw err;
        } finally {
        setIsRestoring(false);
    }
}

  return (
    <div className="space-y-4">
        {/* Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="text-sm flex items-center justify-center gap-2 cursor-pointer p-1 rounded hover:bg-gray-100"
          onClick={onClose}
          aria-label="Back"
        >
          <FiChevronLeft className="w-4 h-4" />
        </button>

        <h3 className="text-sm font-semibold">Archived items</h3>

        <button
          type="button"
          className="p-1 hover:bg-gray-100 transition-colors rounded-md"
          onClick={onClose}
          aria-label="Close"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>

        {/* Content */}
        <div className="space-y-4 flex justify-between gap-4">
            <Input placeholder="Search archived items..." />
            <Button variant="outline" size="sm">
                Card
            </Button>
        </div>
        {/* Archived lists */}
        <div className="space-y-4">
            {archivedList.map((list) => (
                <div key={list.id} className="flex items-center justify-between gap-2 relative font-medium text-sm">
                <span className="min-w-0 flex-1 truncate" title={list.name}>
                    {list.name}
                </span>
                    <div className="flex items-center justify-center gap-2 mb-2 flex-shrink-0">
                        <Button variant="outline" size="sm" className="text-sm" disabled={isRestoring} onClick={() => handleRestoreList(list.id)}><FiRefreshCcw className="w-4 h-4" /> Restore</Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <button
                                    type="button"
                                    className="text-sm flex items-center justify-center gap-2 cursor-pointer p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
                                    disabled={isRestoring}
                                >
                                    <FiTrash2 className="w-4 h-4" />
                                </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent size="sm">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete this list permanently?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. All cards in this list will also be deleted permanently.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        variant="destructive"
                                        onClick={() => deleteListFromBoardPermanently(list.id)}
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            ))}
            {archivedList.length === 0 && (
                <div className="text-sm text-gray-500">No archived lists found</div>
            )}
        </div>
    </div>
  );
}