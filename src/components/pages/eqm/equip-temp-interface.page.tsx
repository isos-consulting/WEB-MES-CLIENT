import React from "react";
import { Container, LineGraph, Searchbox, useSearchbox } from "~/components/UI";
import { getNow } from "~/functions";

export const PgEqmTempInterface = () => {
  const { props } = useSearchbox("SEARCH_INPUTBOX", [
    {type: "datetime", id: "reg_date", label: "조회일시", disabled: false, default: getNow()},
    {type: "datetime", id: "end_date", disabled: false, default: getNow() },
    {type: "text", id: "temperature", label: "온도", disabled: false, default: "",}
  ]);

  props.onSearch = _=>{ };

  return (
    <>
      <Searchbox {...props} />
      <Container>
        <div style={{ width: "100%", height: "80vh"}}>
            <LineGraph data={[]} />
        </div>
      </Container>
    </>
  );
};
