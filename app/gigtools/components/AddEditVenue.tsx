"use client";

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

import { addVenue, updateVenue, selectVenue } from "@/app/gigtools/api/queries";
import { useLoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { PlusIcon } from "@/app/icons/PlusIcon";
import { EditIcon } from "@/app/icons/EditIcon";
import { Venue } from "@/app/types/types";
import { createSlug } from "./_utils";
import { VenueImageUpload } from "./VenueImageUpload";
import clsx from "clsx";
import { lato } from "@/config/fonts";
import { useListingsStore } from "../store/listings";
import { useHoldingStore } from "../store/gigtools";

export const AddEditVenueForm = ({
  id,
  onSubmitSuccess,
}: {
  id: number;
  onSubmitSuccess?: () => void;
}) => {
  const defaultVenue: Venue = {
    id: 0,
    name: "",
    address1: "",
    suburb: "",
    state: "",
    postcode: "",
    url: "",
    lat: "",
    lng: "",
    heroImage: "",
    slug: "",
    description: "",
    phone: "",
    email: "",
  };

  const [venue, setVenue] = useState<Venue>(defaultVenue);

  const [_, setSubmittedData] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: `${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`,
  });

  useEffect(() => {
    if (id !== 0) {
      (async () => {
        const v = await selectVenue(id);
        setVenue({ ...defaultVenue, ...v });
      })();
    } else {
      setVenue(defaultVenue);
    }
  }, [id]);

  const geocodeAddress = async (address: string) => {
    if (!isLoaded) {
      console.log("Google Maps API is not loaded");
      return null;
    }

    return new Promise<{ lat: number; lng: number } | null>((resolve) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (
          status === google.maps.GeocoderStatus.OK &&
          results &&
          results.length > 0
        ) {
          const latitude = results[0].geometry.location.lat();
          const longitude = results[0].geometry.location.lng();
          resolve({ lat: latitude, lng: longitude });
        } else {
          console.log("Geocoding failed");
          resolve(null);
        }
      });
    });
  };

  const validateForm = (data: Venue) => {
    const newErrors: Record<string, string> = {};
    const requiredFields: (keyof Venue)[] = [
      "name",
      "address1",
      "suburb",
      "state",
      "postcode",
      "slug",
      "heroImage",
    ];

    for (const field of requiredFields) {
      if (!data[field] || data[field].toString().trim() === "") {
        newErrors[field] = "This field is required";
      }
    }

    const postcode = data.postcode?.toString() ?? "";
    if (!/^\d{4}$/.test(postcode)) {
      newErrors.postcode = "Postcode must be exactly 4 digits";
    }

    const url = data.url?.toString().trim();
    if (url) {
      try {
        new URL(url);
      } catch (_) {
        newErrors.url = "Invalid URL format";
      }
    }

    const email = data.email?.toString().trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    const slug = data.slug?.toString().trim();
    if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      newErrors.slug =
        "Slug must contain only lowercase letters, numbers, and single hyphens (no spaces or special characters)";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateForm(venue);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const fullAddress = `${venue.address1}, ${venue.suburb}, ${venue.state} ${venue.postcode}`;
    const coords = await geocodeAddress(fullAddress);

    if (!coords) {
      setErrors({ address1: "Failed to geocode address" });
      return;
    }

    const venueData: Venue = {
      ...venue,
      lat: coords.lat.toString(),
      lng: coords.lng.toString(),
    };

    setErrors({});
    setSubmittedData(venueData);

    if (id !== 0) {
      await updateVenue({ ...venueData, venueId: id });
    } else {
      await addVenue(venueData);
    }

    onSubmitSuccess?.();
  };

  const handleHeroImageUpload = (imageUrl: string) => {
    setVenue((prev) => ({ ...prev, heroImage: imageUrl }));
  };

  return (
    <Form
      className="space-y-4"
      onReset={() => setSubmittedData(null)}
      onSubmit={handleSubmit}
    >
      <div className="flex gap-4 w-full">
        <Input
          label="Name"
          name="name"
          placeholder="Venue Name"
          isRequired
          isInvalid={!!errors.name}
          errorMessage={errors.name}
          value={venue.name}
          onChange={(e) => {
            setVenue({
              ...venue,
              name: e.target.value,
              slug: createSlug(e.target.value),
            });
          }}
        />
        <Input
          label="Address"
          name="address1"
          placeholder="Venue Address"
          isRequired
          isInvalid={!!errors.address1}
          errorMessage={errors.address1}
          value={venue.address1}
          onChange={(e) => setVenue({ ...venue, address1: e.target.value })}
        />
      </div>
      <div className="flex gap-4 w-full">
        <Input
          label="Suburb"
          name="suburb"
          placeholder="Venue Suburb"
          isRequired
          isInvalid={!!errors.suburb}
          errorMessage={errors.suburb}
          value={venue.suburb}
          onChange={(e) => setVenue({ ...venue, suburb: e.target.value })}
        />

        <Input
          label="Postcode"
          name="postcode"
          placeholder="4-digit Postcode"
          isRequired
          isInvalid={!!errors.postcode}
          errorMessage={errors.postcode}
          value={venue.postcode || ""}
          onChange={(e) => setVenue({ ...venue, postcode: e.target.value })}
        />

        <Select
          label="State"
          name="state"
          placeholder="Select State"
          isRequired
          isInvalid={!!errors.state}
          errorMessage={errors.state}
          selectedKeys={new Set([venue.state])}
          onSelectionChange={(keys) =>
            setVenue({
              ...venue,
              state: String(Array.from(keys)[0]),
            })
          }
        >
          <SelectItem key="ACT">ACT</SelectItem>
          <SelectItem key="NSW">NSW</SelectItem>
          <SelectItem key="NT">NT</SelectItem>
          <SelectItem key="QLD">QLD</SelectItem>
          <SelectItem key="SA">SA</SelectItem>
          <SelectItem key="TAS">TAS</SelectItem>
          <SelectItem key="VIC">VIC</SelectItem>
          <SelectItem key="WA">WA</SelectItem>
        </Select>
        <Input
          label="Phone Number"
          name="phone"
          placeholder="Venue Phone Number"
          isInvalid={!!errors.phone}
          errorMessage={errors.phone}
          value={venue.phone || ""}
          onChange={(e) => setVenue({ ...venue, phone: e.target.value })}
        />
      </div>
      <div className="flex gap-4 w-full">
        <Input
          label="URL"
          name="url"
          placeholder="Venue URL"
          isInvalid={!!errors.url}
          errorMessage={errors.url}
          value={venue.url || ""}
          onChange={(e) => setVenue({ ...venue, url: e.target.value })}
        />
        <Input
          label="Email"
          name="email"
          placeholder="Venue Email"
          isInvalid={!!errors.email}
          errorMessage={errors.email}
          value={venue.email || ""}
          onChange={(e) => setVenue({ ...venue, email: e.target.value })}
        />
        <Input
          label="Slug"
          name="slug"
          placeholder="Venue Slug"
          isRequired
          isInvalid={!!errors.slug}
          errorMessage={errors.slug}
          value={venue.slug || ""}
          onChange={(e) => setVenue({ ...venue, slug: e.target.value })}
        />
      </div>
      <Textarea
        className="w-full"
        name="description"
        value={venue.description || ""}
        onChange={(e) => setVenue({ ...venue, description: e.target.value })}
        isInvalid={!!errors.description}
        errorMessage={errors.description}
        label="Description"
        placeholder="Venue Description"
      />
      <VenueImageUpload
        onImageUpload={handleHeroImageUpload}
        heroImage={venue.heroImage}
      />
      <div className="flex gap-4">
        <Button className="w-full" color="primary" type="submit">
          Submit
        </Button>
        {/* <Button type="reset" variant="bordered">
          Reset
        </Button> */}
      </div>
      {/* {submittedData && (
        <div className="text-small text-default-500 mt-4">
          Submitted data:{" "}
          <pre className="text-xs whitespace-pre-wrap">
            {JSON.stringify(submittedData, null, 2)}
          </pre>
        </div>
      )}

      <pre className="text-xs whitespace-pre-wrap">
        {JSON.stringify(venue, null, 2)}
      </pre> */}
    </Form>
  );
};

const AddEditVenueModal = ({
  id,
  onSuccess,
}: {
  id: number;
  onSuccess?: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const refreshListings = useListingsStore((state) => state.refreshListings);
  const refreshHolding = useHoldingStore((state) => state.refreshHolding);

  const scraper = useHoldingStore((state) => state.scraper);

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
        onOpenChange={(open) => {
          if (id === 0 || open) {
            setIsOpen(open);
          }
        }}
        className={clsx(lato.className)}
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{id !== 0 ? "Edit Venue" : "Add Venue"}</ModalHeader>
              <ModalBody>
                <div
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <AddEditVenueForm
                    id={id}
                    onSubmitSuccess={() => {
                      setIsOpen(false);
                      onClose();
                      onSuccess?.();
                      refreshListings();
                      refreshHolding(scraper);
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

export const AddEditVenue = ({
  id,
  onSuccess,
}: {
  id: number;
  onSuccess?: () => void;
}) => {
  return <AddEditVenueModal id={id} onSuccess={onSuccess} />;
};
