import { AsyncSelect, SelectComponent, chakraComponents } from "chakra-react-select";
import {
  Button,
  Code,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import DataEditor, { DataEditorProps, GridCellKind, GridColumn, Item } from "@glideapps/glide-data-grid";
import React, { useEffect, useState } from "react";

import Papa from "papaparse";
import { debounce } from "lodash";
import { wdQuery } from "./wdQuery";

const exampleURL = "https://raw.githubusercontent.com/datasets/ppp/master/data/ppp-gdp.csv";

type GlideProps = Partial<DataEditorProps>;
type Column = GridColumn & { wikidataID?: string };

const customComponents: Partial<SelectComponent> = {
  Option: ({ children, ...props }: { children: React.ReactNode }) => (
    // @ts-ignore
    <chakraComponents.Option {...props}>
      <Text size="sm" fontWeight="semibold">
        {children}
      </Text>
      <Text ml={2} size="sm" color="gray">
        {/* @ts-ignore */}
        {props.data.description}
      </Text>
    </chakraComponents.Option>
  ),
};

export const TableAnnotate = ({ url = exampleURL }) => {
  let [data, setData] = useState<string[][]>([
    ["name", "age"],
    ["alex", "30"],
    ["bob", "10"],
  ]);
  const [glideData, setGlideData] = useState<GlideProps>({});
  const [columns, setColumns] = useState<Column[]>([]);

  useEffect(() => {
    Papa.parse(url, {
      download: true,
      complete: function (results: any) {
        const data: string[][] = results.data.slice(0, -1);
        setData(data);
        const dataWithoutCols = data.slice(1);
        const cols = data[0].map((colName: string) => ({
          title: colName,
          id: colName,
          width: 100,
        }));

        setColumns(cols);
        const gd = {
          columns: cols,
          getCellContent: (cell: Item) => {
            let d = "";
            try {
              d = dataWithoutCols[cell[1]][cell[0]];
            } catch (error) {
              console.error("This should never happen", error);
            }
            const out = {
              kind: GridCellKind.Text,
              data: d,
              displayData: d,
              allowOverlay: false,
            };
            // console.log(out);
            return out;
          },
          rows: dataWithoutCols.length,
        };

        // @ts-ignore
        setGlideData(gd);
      },
    });

    return () => {};
  }, [url]);

  const [isOpen, setIsOpen] = useState(false);
  return (
    <Stack>
      <Heading size="md">Columns</Heading>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Code overflow="scroll" whiteSpace="pre-wrap" w="full" borderRadius="lg" p={2}>
              {JSON.stringify(
                columns.map((c) => ({ name: c.title, wikidataID: c.wikidataID })),
                null,
                4
              )}
            </Code>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Stack direction="row" alignItems="center">
        {columns.map((c, idx) => (
          <Stack flexGrow={1} key={idx}>
            <Heading size="sm" fontWeight={500}>
              {c.title}
            </Heading>
            <AsyncSelect
              components={customComponents}
              loadOptions={debounce((input, cb) => {
                console.log(input);

                wdQuery(input).then((res) => {
                  const options = res?.map((s) => ({
                    option: s.id,
                    label: s.label,
                    description: s.description,
                  }));
                  // console.log(options);
                  cb(options);
                });
              }, 200)}
              //   Lol immutable updates immer would be easier
              onChange={(newVal: any) => {
                setColumns((c) => {
                  const n = [
                    ...c.slice(0, idx),
                    { ...c[idx], wikidataID: newVal.option },
                    ...c.slice(idx + 1, c.length),
                  ];
                  // console.log(c, n);
                  return n;
                });
              }}
            ></AsyncSelect>
          </Stack>
        ))}
        <Button
          onClick={() => {
            setIsOpen(true);
          }}
        >
          Export as JSON
        </Button>
      </Stack>
      {/**ts-ignore */}
      {glideData.columns ? (
        <DataEditor {...glideData} width={600} height={600} smoothScrollX={true} smoothScrollY={true} />
      ) : null}
    </Stack>
  );
};

export default TableAnnotate;
