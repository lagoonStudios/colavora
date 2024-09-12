import { View } from "@components/Themed";
import Search from "@molecules/search/Search";
import React from "react";
import { SearchInputProps } from "./SearchInput.types";
import SearchListItems from "@molecules/SearchListItems";
import { useSearchData } from "./SearchInput.functions";

export default function SearchInput(props: SearchInputProps) {
  const { children, style } = props;
  // --- Hooks -----------------------------------------------------------------

  const { open, setOpen, data, setData, loading, handleSearch } = useSearchData(
    { text: "" },
  );
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------

  // --- END: Data and handlers ------------------------------------------------
  return (
    <View>
      <Search
        setItems={setData}
        items={data}
        open={open}
        setOpen={setOpen}
        containerStyle={style}
        handleSearch={handleSearch}
      />
      {open ? <SearchListItems data={data} loading={loading} /> : children}
    </View>
  );
}
