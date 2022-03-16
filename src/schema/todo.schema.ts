import { object, boolean, string, date, ref, array} from "yup";

export const createTodoSchema = object({
  body: object({
    name: string().required("Todo name is required"),
    description: string()
      .required("Todo description is required")
      .max(500, "Discription maximum length is 500."),
    startDate: date()
      .required("Start date is required").default(() => new Date()),
    endDate: date().required().default(null)
	  .when("startDate", (startDate, yup) => startDate && yup.min(startDate, "End date cannot be before Start date")),
	taskList: array().of(object().shape({
		name: string().required("Task name is required"),
		description: string()
	      .required("Task description is required")
	      .max(500, "Discription maximum length is 500."),
	}))
  }),
});
