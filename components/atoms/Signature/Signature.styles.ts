import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "auto",
    display: "flex",
    gap: 10,
    flex: 1,
    maxHeight: 210,
  },
  title: {
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 8,
    fontWeight: 600,
    fontSize: 14,
  },
  signatureBox: { borderWidth: 0.5, borderColor: "black", height: "auto" },
});

export const webStyle = `.m-signature-pad {
  position: fixed;
  margin:auto; 
  top: 0; 
  width:100%;
  height:99%;
}
body,html { 
  position:relative; 
}`;
