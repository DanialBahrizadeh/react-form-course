import type { FC } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

type FormData = {
  username: string;
  email: string;
  channel: string;
  social: {
    twitter: string;
    facebook: string;
  };
  phoneNumbers: string[];
  phNumbers: { number: string }[];
};

const YoutubeForm: FC = () => {
  console.log("it did rerender");
  // the object is optional and you can just write useForm()
  // you don't need a generic type if you set a default value but if you didn't the type is requare for for the handleSubmit function
  // the default can hardcode data or online data that are coming from an api
  const form = useForm<FormData>({
    defaultValues: {
      username: "",
      email: "",
      channel: "",
      social: {
        twitter: "",
        facebook: "",
      },
      phoneNumbers: ["", ""],
      phNumbers: [{ number: "" }],
    },
    // defaultValues: async () => {
    //   const response = await fetch(
    //     "https://jsonplaceholder.typicode.com/users/1"
    //   );
    //   const data = await response.json();
    //   return {
    //     username: data.username,
    //     email: data.email,
    //     channel: "one",
    //   };
    // },
  });

  const { register, control, handleSubmit, formState } = form;
  const { errors } = formState;
  //there are two ways to register the first one os destrucher the following keys from the register object and manuly put the value (read the comment inside the username input to understand)
  // how ever the better way is directly use the spread operator(...) behind the object and destrucher it inside the input element
  // const { name, ref, onChange, onBlur } = register("username");

  const { fields, append, remove } = useFieldArray({
    name: "phNumbers",
    control,
  });

  const onSubmit = (data: FormData) => {
    console.log(`Form submitted and the data is`, data);
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-controle">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            {...register("username", {
              // to set the filed as require and return error if's not filed
              required: "Username filed is required please fill the filed",
            })}
            // name={name}
            // ref={ref}
            // onChange={onChange}
            // onBlur={onBlur}
          />
          <p className="error">{errors.username?.message}</p>
        </div>
        <div className="form-controle">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            {...register("email", {
              // to use regex for validate the inputValue
              pattern: {
                value: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
                message:
                  "The email addrease is not valid please enter a valid enter",
              },
              // if you need to use a custome validate funtion use this
              // the funtion pass the input value as a parameter for the function you give to it
              // if you need more than one function then insted of passing a function as a value for the validate prop
              // give an object value and for each function give any name that you like for example:

              validate: {
                notAdmin: (filedValue) => {
                  return (
                    filedValue !== "admin@example.com" ||
                    "Enter a different email address"
                  );
                },
                notBlackListed: (filedValue) => {
                  return (
                    !filedValue.endsWith("baddomain.com") ||
                    "This domain is not supported"
                  );
                },
                NotBadPeople: (filedValue) => {
                  const blacklist = new Set([
                    "first@example.com",
                    "second@example.com",
                    "third@example.com",
                  ]);
                  if (blacklist.has(filedValue)) {
                    console.log("blocked");
                    return "You are block from the web site";
                  }
                  return true;
                },
              },

              // validate: (filedValue) => {
              //   return (
              //     filedValue !== "admin@example.com" ||
              //     "Enter a different email address"
              //   );
              // },
            })}
          />
          <p className="error">{errors.email?.message}</p>
        </div>
        <div className="form-controle">
          <label htmlFor="channel">Channel</label>
          <input
            type="text"
            id="channel"
            {...register("channel", {
              // you can also write the required as an object
              // required: "Channel filed is required please fill the filed",
              required: {
                value: true,
                message: "Channel filed is required please fill the filed",
              },
            })}
          />
          <p className="error">{errors.channel?.message}</p>
        </div>
        {/* you can use nested form value(data) like that */}
        <div className="form-controle">
          <label htmlFor="twitter">Twitter</label>
          <input
            type="text"
            id="twitter"
            {...register("social.twitter", {
              required: "Sir i'm a big fan and I need your twitter account",
            })}
          />
          <p className="error">{errors.social?.twitter?.message}</p>
        </div>

        <div className="form-controle">
          <label htmlFor="facebook">Facebook</label>
          <input
            type="text"
            id="facebook"
            {...register("social.facebook", {
              required: "Sir i'm a big fan and I need your facebook account",
            })}
          />
          <p className="error">{errors.social?.facebook?.message}</p>
        </div>

        {/* 
          you should use Array.number insted of Array[number] to accece the items 
            with in the array by index like the example down below:
          */}
        <div className="form-controle">
          <label htmlFor="primary-number">Primary phone number</label>
          <input
            type="text"
            id="primary-number"
            {...register("phoneNumbers.0", {
              required: "please enter your number",
              pattern: {
                value: /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/,
                message: "The number is not valid",
              },
            })}
          />
          <p className="error">
            {!errors.phoneNumbers ||
              !errors.phoneNumbers[0] ||
              errors.phoneNumbers[0]?.message}
          </p>
        </div>

        <div className="form-controle">
          <label htmlFor="secondery-number">secondery phone number</label>
          <input
            type="text"
            id="secondery-number"
            {...register("phoneNumbers.1", {
              required: "please enter your number",
              pattern: {
                value: /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/,
                message: "The number is not valid",
              },
            })}
          />
          <p className="error">
            {!errors.phoneNumbers ||
              !errors.phoneNumbers[1] ||
              errors.phoneNumbers[1]?.message}
          </p>
        </div>
        <div>
          <label htmlFor="">list of numbers</label>
          {fields.map((filed, index) => {
            return (
              <div key={filed.id} className="form-controle">
                <input type="text" {...register(`phNumbers.${index}.number`)} />
                {index > 0 && (
                  <button type="button" onClick={() => remove(index)}>
                    Remove
                  </button>
                )}
              </div>
            );
          })}
          <button type="button" onClick={() => append({ number: "" })}>
            Add a number
          </button>
        </div>

        <button>Submit</button>
      </form>
      <DevTool control={control} />
    </div>
  );
};

export default YoutubeForm;
