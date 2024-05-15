import React, { useContext,  useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Collapse,
  Container,
  Fade,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import UserContext from "../../context/UserContext";

import {FileDownload,} from "@mui/icons-material";
import { styled } from "@mui/system";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { toast } from "react-toastify";
import Loader from "../Loader";
import AccessNavBar from "../NavBar/AccessNavBar";
import CryptoJS from "crypto-js";


function createData(
  salary_category,
  salary_actual,
  salary_present,
  deduction_category,
  deduction_actual,
  deduction_present
) {
  // const density = population / size;
  return {
    salary_category,
    salary_actual,
    salary_present,
    deduction_category,
    deduction_actual,
    deduction_present,
  };
}

const PaySlips = () => {
  const [rows, setRows] = useState([]);
  const [loader, setLoader] = useState(false);
  const { userDetails } = useContext(UserContext);
  const [companyDetails, setCompanyDetails] = useState({ company_logo: '', company_address: '' })
  const [viewDetailsFields, setViewDetailsFields] = useState({ year: '', month: '' })
  const [salaryData, setSalaryData] = useState(null)
  const [employeeInfo, setEmployeeInfo] = useState({uan:'',pan_number:''})

  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2000 + 1 }, (_, index) => 2000 + index).reverse();

  const populateTable = (data) => {
    const tempRows = []

    tempRows.push(createData("Basic", data.empsalorgbasic, data.empsalbasic, "EPF", data.empsalorgepf, data.empsalepf))
    tempRows.push(createData("HRA", data.empsalorghra, data.empsalhra, "ESI", data.empsalorgesi, data.empsalesi))
    tempRows.push(createData("Conveyance", data.empsalorgconv, data.empsalconv, "SAL PT", data.empsalorgpt, data.empsalpt))
    tempRows.push(createData("Education Allowance", data.empsalorgedu, data.empsaldeductions, "Income Tax", "NA", data.empsalitax))
    tempRows.push(createData("Shift Allowance", data.empsalorgshift, data.empsalshift, "Others", "NA", data.empsaldebitother))
    tempRows.push(createData("Medical Allowance", data.empsalmedical, data.empsalmed, "Meal Vouchers", "NA", data.empsalsodexo))
    tempRows.push(createData("Travel Allowance", data.empsaltravel, data.empsallta, "Total Deductions", "", data.empsaldeductions))
    tempRows.push(createData("LTA", "NA", data["T/H"], "", "", ""))
    tempRows.push(createData("Others", data.empsalorgsundrycreditothers, data.empsalsundrycreditothers, "", "", ""))
    tempRows.push(createData("Adjustments", "", "", " ", "", ""))
    tempRows.push(createData("Laptop", "NA", data.empsallaptop, "", "", ""))
    tempRows.push(createData("Internet", "NA", data.empsalinternet, "", "", ""))
    tempRows.push(createData("Client Incentive", "NA", data.empsalclientincentive, "", "", ""))
    tempRows.push(createData("Spl. Incentive", "NA", data.empsalincentive, "", "", ""))
    tempRows.push(createData("Bonus", "NA", data.empsalbonus, "", "", ""))
    tempRows.push(createData("Awards", "NA", data.empsalawards, "", "", ""))
    tempRows.push(createData("Others", "NA", data.empsalothers, "", "", ""))
    tempRows.push(createData("Gross Salary of The Employee", data.emporggross, data.empsalgross, "", "", ""))
    tempRows.push(createData("", "", "", "", "", ""))
    tempRows.push(createData("Net Salary", "", "", "", "", data.empsalnet))
    setRows(tempRows)
  }

  const exportPDF = async () => {
    const doc = new jsPDF({ orientation: "vertical" });
    
    let imageHeader = new Image();
    imageHeader.src = `${companyDetails.company_logo === '' ? '' : process.env.REACT_APP_BACKEND_SERVER + companyDetails.company_logo}`;
    doc.addImage(
      imageHeader,
      // param.logo.type,
      30, // 10 + param.logo.margin.left,
      18, // currentHeight - 5 + param.logo.margin.top,
      60, // param.logo.width,
      12.66 // param.logo.height
    );
    doc.setFontSize(10);
    doc.text(
      `${companyDetails.company_address}`,
      120,
      20,
      { maxWidth: 60, align: "justify" }
    );
    const empName = userDetails.first_name + " " + userDetails.last_name;
    const empCode = 'BCG' + userDetails.employee_id;
    const desg = userDetails.designation
    const monthYear = viewDetailsFields.month + " " + viewDetailsFields.year;
    doc.text(
      `\nName of the Employee: ${empName} \nEmployee Code: ${empCode} \nDesignation: ${desg} \nPF Number: ${employeeInfo.uan===''?'null':employeeInfo.uan} \nPAN Number:  ${employeeInfo.pan_number===''?'null':employeeInfo.pan_number} \n\nPay slip for the month of ${monthYear}`,
      30,
      40
    );
    doc.autoTable({
      html: "#payslip-table",
      theme: "grid",
      margin: { left: 30, right: 30, top: 80 },
      // padding: {top: 40}
    });
    doc.text(
      `This is system generated payslip, hence does not require signature.`,
      50,
    260,
 
    );

    doc.save(`${viewDetailsFields.month.slice(0, 3)}_${viewDetailsFields.year}_payslip`);
  };

  const handleDisplayPayslip = async (e) => {
    e.preventDefault()
    try{
      setLoader(true)
      const salaryResult = await axios.post("/api/viewusermonthsalarydata", { ...viewDetailsFields, emp_id: userDetails.employee_id })
      if (salaryResult.data.length !== 0) {
        populateTable(salaryResult.data[0])
      }
      setSalaryData(salaryResult.data)
      const companyResult = await axios.post('/api/companydetails', { emp_id: userDetails.employee_id })
      setCompanyDetails(companyResult.data[0])

      const employeeDetailsResult = await axios.get('/api/employeedetails', { params:{ emp_id: userDetails.employee_id } })
      //console.log(employeeDetailsResult)
      const decrypted_data = JSON.parse(CryptoJS.AES.decrypt(employeeDetailsResult.data, process.env.REACT_APP_DATA_ENCRYPTION_SECRETE).toString(CryptoJS.enc.Utf8))
      if(decrypted_data.length!==0){
        setEmployeeInfo(decrypted_data[0])
      }
      setLoader(false)

    }
    catch(err){
      //console.log(err)
      setLoader(false)
      toast.error(err.response.data);

    }

  };

  return (
    <>
      <Box sx={{ minHeight: { xs: 'auto', lg: '100vh' }, width: "auto", display: 'flex', backgroundColor: '#F5F5F5' }}  >
        <AccessNavBar />
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 5, ml: { xs: 2 }, backgroundColor: '#F5F5F5' }}  >
          <div

            style={{
              height: 'auto',
              width: '100%',
              backgroundColor: '#F5F5F5'
            }}
          >
            <Typography variant='h5' component={'h5'} m={1} textAlign={'center'} >Employee Monthly Salary Details</Typography>
            <Grid container spacing={2} display={'flex'} justifyContent={'center'}  >
              <Grid item xs={12} sm={12} lg={11}>
                <Paper elevation={1} sx={{ p: 1, "&:hover": { boxShadow: 8 } }}>
                  <Box component={'form'} onSubmit={handleDisplayPayslip} p={1}>
                    <Stack spacing={2} direction={{ xs: 'column', lg: 'row' }} >
                      <FormControl sx={{ mb: 2 }} fullWidth variant="outlined">
                        <InputLabel size="small" required>
                          Select Year
                        </InputLabel>
                        <Select
                          size="small"
                          label="Select Year"
                          name="year"
                          required
                          value={viewDetailsFields.year}
                          onChange={e => setViewDetailsFields({ ...viewDetailsFields, year: e.target.value })}
                        >
                          {years.map((name, index) => (
                            <MenuItem key={index} value={name}>
                              {name}
                            </MenuItem>
                          ))}

                        </Select>
                      </FormControl>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel size="small" required>
                          Select Month
                        </InputLabel>
                        <Select
                          size="small"
                          name="month"
                          label='Select Month'
                          required
                          value={viewDetailsFields.month}
                          onChange={e => setViewDetailsFields({ ...viewDetailsFields, month: e.target.value })}
                        >
                          <MenuItem value="january">January</MenuItem>
                          <MenuItem value="february">February</MenuItem>
                          <MenuItem value="march">March</MenuItem>
                          <MenuItem value="april">April</MenuItem>
                          <MenuItem value="may">May</MenuItem>
                          <MenuItem value="june">June</MenuItem>
                          <MenuItem value="july">July</MenuItem>
                          <MenuItem value="august">August</MenuItem>
                          <MenuItem value="september">September</MenuItem>
                          <MenuItem value="october">October</MenuItem>
                          <MenuItem value="nov">November</MenuItem>
                          <MenuItem value="december">December</MenuItem>
                        </Select>
                      </FormControl>

                      <FormControl fullWidth variant="outlined">
                        <Button color='info' variant="contained" type='submit'>View Details</Button>
                      </FormControl>
                      <Fade in={salaryData !== null && salaryData.length !== 0} timeout={1000} >
                        <IconButton title="Download Payslip"  color="info" onClick={exportPDF}> <FileDownload /> </IconButton>
                      </Fade>

                    </Stack>

                  </Box>
                  <Collapse in={salaryData === null} timeout={'auto'} unmountOnExit>
                    <Box sx={{ maxHeight: '300px', m: 2, width: '100%', display: 'flex', justifyContent: 'center',  }}>
                      <img style={{ objectFit: 'contain', width: '100%', height: 'auto' }} src='salaryDetails.png' alt='salaryDetails' />
                    </Box>
                  </Collapse>
                  <Collapse in={salaryData !== null} unmountOnExit timeout={'auto'}>

                    <Collapse in={salaryData !== null && salaryData.length !== 0} timeout={'auto'} unmountOnExit>
                      <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Root
                          sx={{
                            maxWidth: "90%",
                            width: "90%",
                            my: "24px",
                            backgroundColor: "#a2deb2",
                          }}
                        >
                          <table
                            aria-label="custom pagination table"
                            id="payslip-table"
                          >
                            <tbody>
                              <tr height="18">
                                <th
                                  colSpan="3"
                                  align="center"
                                  style={{ backgroundColor: "#679e76" }}
                                >
                                  Total Salary
                                </th>
                                <th
                                  colSpan="3"
                                  align="center"
                                  style={{ backgroundColor: "#679e76" }}
                                >
                                  Deductions
                                </th>
                              </tr>
                              <tr height="24">
                                <th
                                  style={{ width: 160, backgroundColor: "#679e76" }}
                                ></th>
                                <th style={{ width: 60, backgroundColor: "#679e76" }}>
                                  Present
                                </th>
                                <th style={{ width: 60, backgroundColor: "#679e76" }}>
                                  Actuals
                                </th>
                                <th
                                  style={{ width: 160, backgroundColor: "#679e76" }}
                                ></th>
                                <th style={{ width: 60, backgroundColor: "#679e76" }}>
                                  Present
                                </th>
                                <th style={{ width: 60, backgroundColor: "#679e76" }}>
                                  Actuals
                                </th>
                              </tr>
                              {rows.map((row,index) => (
                                <tr height="2" key={index}>
                                  <td style={{ width: 160 }}>
                                    {row.salary_category}
                                  </td>
                                  <td
                                    className="val"
                                    style={{ width: 60 }}
                                    align="right"
                                  >
                                    {row.salary_actual}
                                  </td>
                                  <td
                                    className="val"
                                    style={{ width: 60 }}
                                    align="right"
                                  >
                                    {row.salary_present}
                                  </td>
                                  <td style={{ width: 160 }}>
                                    {row.deduction_category}
                                  </td>
                                  <td
                                    className="val"
                                    style={{ width: 60 }}
                                    align="right"
                                  >
                                    {row.deduction_actual}
                                  </td>
                                  <td
                                    className="val"
                                    style={{ width: 60 }}
                                    align="right"
                                  >
                                    {row.deduction_present}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </Root>
                      </Container>
                    </Collapse>
                    <Collapse in={salaryData !== null && salaryData.length === 0} timeout={'auto'} unmountOnExit>
                      <Box sx={{ maxHeight: '300px', width: '100%', display: 'flex', justifyContent: 'center',backgroundColor:'#fafbfd' }}>
                        <img style={{ objectFit: 'contain', width: '100%', height: 'auto' }} src='norecordfound.gif' alt='norecordfound' />
                      </Box>
                    </Collapse>
                  </Collapse>
                </Paper>
              </Grid>
            </Grid>
          </div>
        </Box>
      </Box>
      <Loader loader={loader} />
      
    </>
  );
};

export default PaySlips;

const Root = styled("div")(
  ({ theme }) => `
    table {
      font-family: 'IBM Plex Sans', sans-serif;
      font-size: 0.875rem;
      border-collapse: collapse;
      width: 100%;
    }

    td,
    th {
      border: 1px solid ${theme.palette.mode === "dark" ? grey[500] : grey[200]
    };
      text-align: left;
      padding: 8px;
    }

    th {
      text-align: center;
    }

    .val {
      text-align: right;
    }


    th {
      background-color: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    }
    `
);

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

