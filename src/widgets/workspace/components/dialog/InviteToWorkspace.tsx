import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger, DialogClose, DialogHeader } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { useEffect, useState } from "react";
import type { GetAllMemberOfWorkspaceButNotInWorkspaceResponse } from "@/features/projects/index";
import { useWorkspaceContext } from "@/features/providers/WorkspaceProvider";
import conKhiImg from "@/shared/assets/img/conKhi.jpg";

interface InviteToWorkspaceProps {
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    triggerButton?: React.ReactNode;
    workspaceId: string;
}

export function InviteToWorkspace({ isOpen, onOpenChange, triggerButton, workspaceId }: InviteToWorkspaceProps) {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [allUsers, setAllUsers] = useState<GetAllMemberOfWorkspaceButNotInWorkspaceResponse[]>([]);
    const [invitedUsers, setInvitedUsers] = useState<string[]>([]); // ✅ State riêng để track invited users
    
    const { fetchAllMemberOfWorkspaceButNotInWorkspace } = useWorkspaceContext();

    useEffect(() => {
        if (isOpen) {
            setInvitedUsers([]); 
            fetchAllMemberOfWorkspaceButNotInWorkspaceData();
        }
    }, [isOpen, workspaceId]);

    const fetchAllMemberOfWorkspaceButNotInWorkspaceData = async () => {
        try {
            const data = await fetchAllMemberOfWorkspaceButNotInWorkspace(workspaceId);
            setAllUsers(data);
        } catch (err) {
            console.error(`Failed to fetch users: ${err}`);
        }
    }

    const handleSendInvitation = async () => {
        if (!email.trim() || isSubmitting) return;
        
        setIsSubmitting(true);
        try {
            
            setEmail("");
        } catch (err) {
            console.error(`Failed to send invitation: ${err}`);
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleQuickInvite = async (user: GetAllMemberOfWorkspaceButNotInWorkspaceResponse) => {
        if (invitedUsers.includes(user.id) || isSubmitting) return;
        
        setIsSubmitting(true);
        try {
            
            setInvitedUsers([...invitedUsers, user.id]);
        } catch (err) {
            console.error(`Failed to invite user: ${err}`);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            {triggerButton && <DialogTrigger asChild>{triggerButton}</DialogTrigger>}
            
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-semibold">
                            Invite to Workspace
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-sm text-gray-600">
                        Invite team members to collaborate on this workspace.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Invite by Email Section */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-900">
                            Invite by Email
                        </label>
                        <Input
                            type="email"
                            placeholder="Enter email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !isSubmitting) {
                                    handleSendInvitation();
                                }
                            }}
                            className="w-full mt-2"
                        />
                        <Button
                            onClick={handleSendInvitation}
                            className="w-full bg-black hover:bg-gray-800 text-white"
                            disabled={!email.trim() || isSubmitting}
                        >
                            {isSubmitting ? "Sending..." : "Send Invitation"}
                        </Button>
                    </div>

                    {/* Quick Invite Section */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-900">
                            Quick Invite
                        </label>
                        <div className="space-y-2">
                            {allUsers.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4">
                                    No users available to invite
                                </p>
                            ) : (
                                allUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between py-2"
                                    >
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={user.avatar_url || conKhiImg}
                                                alt={user.name}
                                                className="w-10 h-10 rounded-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src = conKhiImg;
                                                }}
                                            />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => handleQuickInvite(user)}
                                            className="bg-black hover:bg-gray-800 text-white px-6"
                                            size="sm"
                                            disabled={invitedUsers.includes(user.id) || isSubmitting}
                                        >
                                            {invitedUsers.includes(user.id) ? "Invited" : "Invite"}
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end pt-4 border-t">
                    <DialogClose asChild>
                        <Button variant="outline" className="px-6" disabled={isSubmitting}>
                            Cancel
                        </Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    )
}