import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { useState } from "react";
import { deleteListing } from "../api/queries";
import { DownArrowIcon } from "@/app/icons/DownArrowIcon";
import { CloseIcon } from "@/app/icons/CloseIcon";

export const DeleteListing = ({
  listingId,
  onDelete,
}: {
  listingId: number;
  onDelete: (id: number) => void;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  return (
    <>
      <Button
        isIconOnly
        onPress={() => {
          setError("");
          setSuccess("");
          onOpenChange();
        }}
      >
        <CloseIcon size={16} filled={true} fill={"#ffffff"} />
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Delete Listing</ModalHeader>
              <ModalBody>
                Are you sure you want to delete this listing?
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="secondary"
                  onPress={() => {
                    onOpenChange();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  isLoading={loading}
                  onPress={async () => {
                    setLoading(true);
                    try {
                      await deleteListing(listingId);
                      setSuccess("Listing deleted successfully");
                      onDelete(listingId);
                    } catch (err) {
                      setError("Failed to delete listing");
                    } finally {
                      setLoading(false);
                      onOpenChange();
                    }
                  }}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
