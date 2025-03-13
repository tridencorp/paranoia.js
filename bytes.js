import { log } from "console";

// Encode data to bytes.
export function encode(...items) {

  items.forEach((item, _) => {
    switch (items[0].constructor.name) {
      case "Array":
        log(items[0].constructor.name == "Array");
        break;
    };
  });
}
