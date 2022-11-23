import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import DataEditor, {
  DataEditorProps,
  GridCellKind,
  GridColumn,
  Item,
} from "@glideapps/glide-data-grid";
import { AsyncSelect, chakraComponents } from "chakra-react-select";
import { Heading, Stack, Text, VStack } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { betterQuery, wdQuery } from "./wdQuery";
import {debounce} from "lodash"

const exampleURL =
  "https://raw.githubusercontent.com/datasets/ppp/master/data/ppp-gdp.csv";

type GlideProps = Partial<DataEditorProps>;
type Column = GridColumn & {wikidataID?: string};
const customComponents = {
  Option: ({ children, ...props }) => (
    <chakraComponents.Option {...props}>
      <Text size="sm" fontWeight="semibold">
        {children}
      </Text>
      <Text ml={2} size="sm" color="gray">
        {props.data.description}
      </Text>
    </chakraComponents.Option>
  ),
};

export default () => {
  let [data, setData] = useState<string[][]>([
    ["name", "age"],
    ["alex", "30"],
    ["bob", "10"],
  ]);
  const [glideData, setGlideData] = useState<GlideProps>({});
  const [columns, setColumns] = useState<Column[]>([]);

  useEffect(() => {
    Papa.parse(exampleURL, {
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
        console.log(gd);

        setGlideData(gd);
      },
    });

    return () => {};
  }, [exampleURL]);

  //   console.log(data);
  console.log(columns);
  

  return (
    <Stack>
      <Heading size="md">Columns</Heading>
      <Stack direction="row">
        {columns.map((c, idx) => (
          <Stack w={1/(columns.length)} key={idx}>
            <Heading size="sm" fontWeight={500}>
              {c.title}
            </Heading>
            <AsyncSelect
              components={customComponents}
              loadOptions={debounce((input, cb) => {
                wdQuery(input).then((res) => {
                  console.log(res);
                  const options = res?.map((s) => ({
                    option: s.id,
                    label: s.label,
                    description: s.description,
                  }));
                  console.log(options);
                  cb(options);
                });
              }, 50)}
            //   Lol immutable updates immer would be easier
              onChange={(newVal: any) => {
                setColumns((c) => {
                    const n =[...c.slice(0, idx), {...c[idx], wikidataID: newVal.option}, ...c.slice(idx+1,c.length)]
                    // console.log(c, n);
                    return n
                })
              }}
            ></AsyncSelect>
          </Stack>
        ))}
      </Stack>
      {/**ts-ignore */}
      {glideData.columns ? (
        <DataEditor
          {...glideData}
          width={600}
          height={600}
          smoothScrollX={true}
          smoothScrollY={true}
        />
      ) : null}
    </Stack>
  );
};
