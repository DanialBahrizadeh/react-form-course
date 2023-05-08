import { FC, useEffect, useState } from "react";
import { useForm, useFieldArray, FieldErrors } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

let renderTime = 0;

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
  age: number;
  dob: Date;
};

const YoutubeForm: FC = () => {
  renderTime++;
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
      age: 0,
      dob: new Date(),
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

  const {
    register,
    control,
    handleSubmit,
    formState,
    watch,
    getValues,
    setValue,
    reset,
  } = form;

  const { errors, isValid, isSubmitting, isSubmitSuccessful } = formState;

  //there are some functions that aren't that important there are about submiting and the state of the submit like isSibmited isSubmiting submitCount and other, the most important one I thing it's isSubmitting which tell you if the form is sumbiting
  // but you still can use some of them like isSubmitSuccessful with other function like reset()
  // its recommended to not use reset() in the onSubmit method but using reset() in useEffect with isSubmitSuccessful
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  // the touched fields are by default false and will change to true when the user focus on the field and when he unfocus again.
  // the dirty fileds are by default false and will change to true when the user modify the field btw if the user modifyed the field then rewrite the old value dirty will be false once again
  // const {touchedFields, dirtyFields, isDirty } = formState;
  // console.log({ touchedFields, dirtyFields });
  // notes that there are isDirty to with chech if the form state is dirty or not

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
  // you can use onError so its work if the submit didn't work btw the errors are the same of errors that come from formState
  const onError = (errors: FieldErrors<FormData>) => {
    console.log("you have errors", errors);
  };

  // you can also watch an array of inputs by using watch(['username', 'email']) and if you didn't pass anything and just said watch() it'll return the whole form object
  // you can use the watch here like that:
  // const watchUsername = watch("username");
  // or in a better way by using the useEffect, its better becaue it won't rerender the page every time you enter something but it'll have always fresh data every time a user enter a word
  useEffect(() => {
    const sub = watch((value) => {
      console.log(value);
    });
    return () => sub.unsubscribe();
  }, [watch]);

  // another good way to get value is using getValues() method which unlike watch method does not rerender the page every time you enter something other then that there are much a like
  // you could use getValues("username") to get the value from a specific filed
  const handleGetValue = () => {
    console.log("the value are", getValues());
  };

  // as we all know if there are a get value there are a set value too
  // the third argument aren't requare but if you didn't pass it it wont affect the touch and dirty state of the form and it won't validate the value you enterd
  const handleSetValue = () => {
    setValue("username", "I'am BATMAN", {
      shouldValidate: true,
      shouldTouch: true,
      shouldDirty: true,
    });
  };

  return (
    <div>
      <h1>this page has been rendered {renderTime} time</h1>
      {/* <h2>Watched value: {JSON.stringify(watchUsername)}</h2> */}
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
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

                // this is have you use async validation but be aware that if you use async validation the isValid method will be false
                // emailAvailable: async (filedValue) => {
                //   const response = await fetch(
                //     `https://jsonplaceholder.typicode.com/users?email=${filedValue}`
                //   );
                //   const data: [] = await response.json();
                //   return data.length === 0 || "the Email is already exists";
                // },
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
              // if the disabled is true then the filed will be disabled and the user won't be able to enter anything and the value will be undefined and validation will be off
              // disabled: watch("username") === "fucktwitter",
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
        <div className="form-controle">
          <label htmlFor="age">age</label>
          <input
            type="number"
            id="age"
            {...register("age", {
              // if you need the value to store as number like 20 insted of "20" you need add this property
              valueAsNumber: true,
              required: "Sir i'm a big fan and I need your facebook account",
            })}
          />
          <p className="error">{errors.social?.facebook?.message}</p>
        </div>
        <div className="form-controle">
          <label htmlFor="dob">Date of birth</label>
          <input
            type="date"
            id="dob"
            {...register("dob", {
              // if you need the value to store as Date object then use this
              valueAsDate: true,
              required: "Sir i'm a big fan and I need your facebook account",
            })}
          />
          <p className="error">{errors.social?.facebook?.message}</p>
        </div>

        <button type="submit" disabled={!isValid || isSubmitting}>
          Submit
        </button>
        <button type="button" onClick={() => reset()}>
          Reset
        </button>
        <button type="button" onClick={handleGetValue}>
          get value
        </button>
        <button type="button" onClick={handleSetValue}>
          Set the Username
        </button>
      </form>
      <DevTool control={control} />
    </div>
  );
};

export default YoutubeForm;
