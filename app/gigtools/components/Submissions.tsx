"use client";

import {
  Button,
  Form,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

import { addToHolding } from "../api/queries";
import { useHoldingStore } from "../store/gigtools";

type Submission = {
  artist: string;
  url: string;
  starttime: string;
  startdate: string;
  venue: string;
  hidden: boolean;
  scraper: string;
  submittedBy?: string;
};

const inputStyles: React.CSSProperties = {
  margin: "0",
};

export const Submissions = ({ submittedBy }: { submittedBy?: string }) => {
  const { refreshHolding } = useHoldingStore();

  const submitSubmission = async (formData: FormData) => {
    const submission: Submission = {
      artist: formData.get("artist")?.toString() ?? "",
      url: formData.get("url")?.toString() ?? "",
      starttime: formData.get("starttime")?.toString() ?? "",
      startdate: formData.get("startdate")?.toString() ?? "",
      venue: formData.get("venue")?.toString() ?? "",
      hidden: false,
      scraper: "submissions",
      submittedBy: submittedBy?.toString(),
    };

    try {
      await addToHolding(submission);
      refreshHolding("submissions");
    } catch (err) {
      console.error("Failed to add submission:", err);
    }
  };

  return (
    <>
      <Form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget as HTMLFormElement;
          const formData = new FormData(form);
          await submitSubmission(formData);
        }}
      >
        <Table
          isKeyboardNavigationDisabled
          aria-label=""
          topContent={
            <div className="flex justify-between items-center py-2">
              <h4 className="text-medium font-medium">Submit</h4>
            </div>
          }
        >
          <TableHeader>
            <TableColumn width={"30%"}>ARTIST</TableColumn>
            <TableColumn>VENUE</TableColumn>
            <TableColumn>URL (Ticket / Artist)</TableColumn>
            <TableColumn width={"120"}>TIME</TableColumn>
            <TableColumn width={"140"}>DATE</TableColumn>
            <TableColumn width={"180"}>TOOLS</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="p-0">
                <Input
                  name="artist"
                  placeholder="Listing Name"
                  isRequired
                  radius="sm"
                />
              </TableCell>
              <TableCell className="pr-0 pl-2">
                <Input
                  name="venue"
                  placeholder="Venue Name"
                  isRequired
                  radius="sm"
                />
              </TableCell>
              <TableCell className="pr-0 pl-2">
                <Input
                  name="url"
                  placeholder="Listing URL"
                  isRequired
                  radius="sm"
                />
              </TableCell>
              <TableCell className="pr-0 pl-2">
                <Input
                  name="starttime"
                  placeholder="Start Time"
                  type="time"
                  step="300"
                  isRequired
                  radius="sm"
                />
              </TableCell>
              <TableCell className="pr-0 pl-2">
                <Input name="startdate" type="date" isRequired radius="sm" />
              </TableCell>
              <TableCell className="pr-0">
                <div className="flex gap-2">
                  <Button type="submit" color="primary">
                    Add
                  </Button>
                  <Button type="reset" color="danger">
                    Reset
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Form>
    </>
  );
};
