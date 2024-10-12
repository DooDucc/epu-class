import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { StyledCard, StyledContainer } from "../styles";
import { ROLE } from "../utils";
import { appPaths, useAppDispatch } from "../../base";
import { register } from "../redux/actions";

const Register = () => {
  const dispatch = useAppDispatch();

  const [values, setValues] = useState({
    role: ROLE.STUDENT,
    email: "",
    studentCode: "",
    fullName: "",
    className: "",
    phone: "",
    password: "",
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const email = data.get("email");
    const studentCode = data.get("studentCode");
    const fullName = data.get("fullName");
    const phone = data.get("phone");
    const password = data.get("password");
    const className = data.get("className");

    dispatch(
      register({
        studentCode: studentCode?.toString() ?? "",
        email: email?.toString() ?? "",
        password: password?.toString() ?? "",
        fullName: fullName?.toString() ?? "",
        phone: phone?.toString() ?? "",
        className: className?.toString() ?? "",
        handleSuccess: () => {
          toast.success("Register successfully");
        },
        handleError: (errorMessage: string) => {
          toast.error(errorMessage);
        },
      })
    );
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <CssBaseline />
      <StyledContainer direction="column" justifyContent="space-between">
        <Stack
          sx={{
            justifyContent: "center",
            height: "100dvh",
            p: 2,
          }}
        >
          <StyledCard variant="outlined">
            <Typography
              component="h1"
              variant="h4"
              sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
            >
              Sign up
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                gap: 2,
              }}
            >
              <FormControl
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <FormLabel
                  id="demo-row-radio-buttons-group-label"
                  style={{ marginRight: "12px" }}
                >
                  Role:
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="role"
                  onChange={(e) => handleInputChange(e)}
                  defaultValue={values.role}
                >
                  <FormControlLabel
                    value={ROLE.STUDENT}
                    control={<Radio />}
                    label="Student"
                  />
                  <FormControlLabel
                    value={ROLE.TEACHER}
                    control={<Radio />}
                    label="Teacher"
                  />
                </RadioGroup>
              </FormControl>
              {values?.role === ROLE.STUDENT ? (
                <>
                  <FormControl>
                    <FormLabel htmlFor="email">Student Code</FormLabel>
                    <TextField
                      type="text"
                      name="studentCode"
                      placeholder="Your code..."
                      required
                      fullWidth
                      variant="outlined"
                      onChange={(e) => handleInputChange(e)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="className">Class</FormLabel>
                    <TextField
                      type="text"
                      name="className"
                      placeholder="Your class..."
                      required
                      fullWidth
                      variant="outlined"
                      value={values.className}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </FormControl>
                </>
              ) : (
                <FormControl>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <TextField
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    autoComplete="email"
                    required
                    fullWidth
                    variant="outlined"
                    onChange={(e) => handleInputChange(e)}
                  />
                </FormControl>
              )}
              <FormControl>
                <FormLabel htmlFor="fullName">Full Name</FormLabel>
                <TextField
                  type="text"
                  name="fullName"
                  required
                  fullWidth
                  variant="outlined"
                  value={values.fullName}
                  placeholder="Your full name..."
                  onChange={(e) => handleInputChange(e)}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="phone">Phone</FormLabel>
                <TextField
                  type="text"
                  name="phone"
                  required
                  fullWidth
                  variant="outlined"
                  value={values.phone}
                  placeholder="Your phone number..."
                  onChange={(e) => handleInputChange(e)}
                />
              </FormControl>
              <FormControl>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <FormLabel htmlFor="password">Password</FormLabel>
                </Box>
                <TextField
                  name="password"
                  placeholder="Password..."
                  type="password"
                  autoComplete="current-password"
                  required
                  fullWidth
                  variant="outlined"
                  onChange={(e) => handleInputChange(e)}
                />
              </FormControl>
              <Button type="submit" fullWidth variant="contained">
                Sign up
              </Button>
              <Typography sx={{ textAlign: "center" }}>
                Already have an account?{" "}
                <span>
                  <Link
                    href={appPaths.SIGN_IN}
                    variant="body2"
                    sx={{ alignSelf: "center" }}
                  >
                    Sign in
                  </Link>
                </span>
              </Typography>
            </Box>
          </StyledCard>
        </Stack>
      </StyledContainer>
    </>
  );
};

export default Register;
