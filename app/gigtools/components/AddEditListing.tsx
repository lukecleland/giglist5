import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Form,
  Textarea,
} from "@heroui/react";
import { Listing } from "@/app/types/types";
import {
  addListing,
  updateListing,
  selectListing,
} from "@/app/gigtools/api/queries";
import { EditIcon } from "@/app/icons/EditIcon";
import { PlusIcon } from "@/app/icons/PlusIcon";
import clsx from "clsx";
import { lato } from "@/config/fonts";

const parseDate = (dateString: string) => {
  let date = new Date(dateString);
  if (isNaN(date.getTime())) {
    date = new Date();
  }
  return date;
};

export const AddEditListingForm = ({
  id,
  onSuccess,
}: {
  id: number;
  onSuccess?: () => void;
}) => {
  const defaultListing: Listing = {
    id: 0,
    name: "",
    url: "",
    starttime: "",
    startdate: new Date(),
    venueName: "",
    tourName: "",
    listedBy: 0,
    holdingId: 0,
    venueId: 0,
  };

  const [listing, setListing] = useState<Listing>(defaultListing);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id !== 0) {
      (async () => {
        const listing = await selectListing(id);
        setListing(listing);
      })();
    } else {
      setListing(defaultListing);
    }
  }, [id]);

  const validateForm = (data: Listing) => {
    const newErrors: Record<string, string> = {};

    const requiredFields: (keyof Listing)[] = [
      "name",
      "url",
      "starttime",
      "startdate",
      "venueName",
    ];

    for (const field of requiredFields) {
      if (!data[field] || data[field].toString().trim() === "") {
        newErrors[field] = "This field is required";
      }
    }

    const url = data.url?.toString().trim();
    if (url && !/^https?:\/\/[^ ]+$/i.test(url)) {
      newErrors.url = "Invalid URL format";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateForm(listing);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    const listingData: Listing = { ...listing };

    if (id !== 0) {
      await updateListing(listingData);
    } else {
      await addListing(listingData);
    }

    onSuccess?.();
  };

  try {
    console.log(
      listing.startdate,
      typeof listing.startdate,
      new Date(listing.startdate || "2000-01-01").toISOString().slice(0, 10)
    );
  } catch (error) {
    console.error("Error parsing date:", error);
  }

  return (
    <Form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        label="Name"
        name="name"
        placeholder="Listing Name"
        isRequired
        isInvalid={!!errors.name}
        errorMessage={errors.name}
        value={listing.name}
        onChange={(e) => setListing({ ...listing, name: e.target.value })}
      />
      <Input
        label="URL"
        name="url"
        placeholder="Listing URL"
        isRequired
        isInvalid={!!errors.url}
        errorMessage={errors.url}
        value={listing.url}
        onChange={(e) => setListing({ ...listing, url: e.target.value })}
      />
      <Input
        label="Start Time"
        name="starttime"
        placeholder="Start Time"
        type="time"
        isRequired
        isInvalid={!!errors.starttime}
        errorMessage={errors.starttime}
        value={listing.starttime || ""}
        onChange={(e) => setListing({ ...listing, starttime: e.target.value })}
      />
      <Input
        label="Start Date"
        name="startdate"
        type="date"
        isRequired
        isInvalid={!!errors.startdate}
        errorMessage={errors.startdate}
        value={new Date(listing.startdate || "2000-01-01").toLocaleDateString(
          "en-CA"
        )}
        onChange={(e) =>
          setListing({
            ...listing,
            startdate: parseDate(e.target.value),
          })
        }
      />
      <Input
        label="Venue Name"
        name="venueName"
        placeholder="Venue Name"
        isRequired
        isInvalid={!!errors.venueName}
        errorMessage={errors.venueName}
        value={listing.venueName}
        onChange={(e) => setListing({ ...listing, venueName: e.target.value })}
      />
      <Select
        label="Listing Type"
        name="type"
        isInvalid={!!errors.type}
        errorMessage={errors.type}
        selectedKeys={listing.type ? new Set([listing.type]) : new Set()}
        onSelectionChange={(keys) =>
          setListing({
            ...listing,
            type: Array.from(keys)[0] as "Festival" | "Concert" | "Pub",
          })
        }
      >
        <SelectItem key="Festival">Festival</SelectItem>
        <SelectItem key="Concert">Concert</SelectItem>
        <SelectItem key="Pub">Pub</SelectItem>
      </Select>
      <Textarea
        label="Special Guests"
        placeholder="Special Guests"
        value={listing.specialGuests || ""}
        onChange={(e) =>
          setListing({ ...listing, specialGuests: e.target.value })
        }
      />
      <Button type="submit">Submit</Button>
    </Form>
  );
};

const AddEditListingModal = ({
  id,
  onSuccess,
}: {
  id: number;
  onSuccess?: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <>
      <Button
        color="primary"
        onPress={() => setIsOpen(true)}
        isIconOnly
        size={id !== 0 ? "sm" : "md"}
      >
        {id !== 0 ? <EditIcon size={16} /> : <PlusIcon />}
      </Button>
      <Modal
        size="5xl"
        isOpen={isOpen}
        onOpenChange={(open) => setIsOpen(open)}
        className={clsx(lato.className)}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {id !== 0 ? "Edit Listing" : "Add Listing"}
              </ModalHeader>
              <ModalBody>
                <div
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <AddEditListingForm
                    id={id}
                    onSuccess={() => {
                      setIsOpen(false);
                      onClose();
                      onSuccess?.();
                    }}
                  />
                </div>
              </ModalBody>
              <ModalFooter />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export const AddEditListing = ({
  id,
  onSuccess,
}: {
  id: number;
  onSuccess?: () => void;
}) => {
  return <AddEditListingModal id={id} onSuccess={onSuccess} />;
};
