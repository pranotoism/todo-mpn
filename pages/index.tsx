import React from "react";
import Head from "next/head";
import type { NextPage } from "next";

// Import from dep
import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm, useFieldArray } from "react-hook-form";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Droppable, Draggable, DragDropContext } from "react-beautiful-dnd";
import { Box, Card, Grid, Button, TextField, CardContent } from "@mui/material";

// Import from local
import { AppBarLayout } from "../src";

type FormValues = {
  todos: {
    todo: string;
    rule: "unrequired" | "required";
  }[];
};

const Home: NextPage = () => {
  const {
    register,
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onBlur",
  });

  const { fields, append, remove, prepend, move } = useFieldArray({
    control,
    name: "todos",
  });

  const [val, setVal] = React.useState(0);
  const [isSubmitButtonShow, setIsSubmitButtonShow] = React.useState(false);

  React.useEffect(() => {
    setVal((val) => val + 1);
    if (val === 0) {
      prepend(JSON.parse(localStorage.getItem("todos") as any));
    }
  }, []);

  const watchTodos = watch("todos");

  const onSubmit = (data: FormValues) => {
    localStorage.setItem("todos", JSON.stringify(watchTodos));
    setIsSubmitButtonShow(false);
  };

  const handleDrag = ({ source, destination }: any) => {
    if (destination) {
      move(source.index, destination.index);
      setIsSubmitButtonShow(true);
    }
  };

  return (
    <>
      <Head>
        <title>Todo Mapan</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <AppBarLayout>
        <>
          {/* Form Region */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <DragDropContext onDragEnd={handleDrag}>
              <Droppable droppableId="droppable-todo">
                {(provided: any) => (
                  <Box ref={provided.innerRef} {...provided.droppableProps}>
                    {fields.map((item, index) => (
                      <Draggable
                        draggableId={`item-${index}`}
                        index={index}
                        key={`test[${index}]`}
                      >
                        {(provided2: any) => (
                          <Card
                            key={item.id}
                            ref={provided2.innerRef}
                            {...provided2.draggableProps}
                            sx={{ mb: 3, ":hover": { cursor: "pointer" } }}
                            onClick={() => {
                              setIsSubmitButtonShow(true);
                            }}
                          >
                            <CardContent>
                              <Grid container spacing={2} alignItems="center">
                                <Grid
                                  item
                                  xs={12}
                                  {...provided2.dragHandleProps}
                                  sx={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    ":hover": { cursor: "pointer" },
                                  }}
                                >
                                  <Box sx={{ transform: "rotate(90deg)" }}>
                                    <DragIndicatorIcon />
                                  </Box>
                                </Grid>
                                <Grid
                                  item
                                  xs={12}
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="space-between"
                                >
                                  <TextField
                                    required
                                    {...register(`todos.${index}.todo` as any, {
                                      required: true,
                                    })}
                                    value={watch(`todos.${index}.todo`)}
                                    fullWidth
                                    id="filled-basic"
                                    label="Task"
                                    variant="filled"
                                  />
                                  {isSubmitButtonShow && (
                                    <DeleteIcon
                                      sx={{ ml: 2 }}
                                      onClick={() => remove(index)}
                                      color="error"
                                    />
                                  )}
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </DragDropContext>
            <Button
              sx={{ mb: 2 }}
              type="submit"
              variant="contained"
              fullWidth
              onClick={() => {
                append({
                  todo: "",
                  rule: "unrequired",
                });
                setIsSubmitButtonShow(true);
              }}
              startIcon={<AddIcon />}
            >
              Add Task
            </Button>
            {isSubmitButtonShow && (
              <Button
                type="submit"
                color="success"
                variant="contained"
                fullWidth
                startIcon={<DoneIcon />}
              >
                Save
              </Button>
            )}
          </form>
        </>
      </AppBarLayout>
    </>
  );
};

export default Home;
