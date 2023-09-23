import { omitBy, isEmpty } from "lodash";

export default function removeNilorEmptyProps(object: any) {
  return omitBy(object, isEmpty);
}
