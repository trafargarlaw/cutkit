import { useFormContext } from "react-hook-form";
import type { StepsFormData } from "../studio";

export function ImagesTab() {
  const { register, watch, setValue } = useFormContext<StepsFormData>();

  // we'd have multiple images
  // every image has text timestamp and prompt description
  // first we generate the images and showthem in the bottom with first one selected
  //

  return <div>images tab</div>;
}

export default ImagesTab;
