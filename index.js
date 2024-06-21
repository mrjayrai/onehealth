const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
const connectTomongo = require("./db");
connectTomongo();
const port = 5000;
const express = require("express");
app.use(cors());
app.use(express.json());


// models 
const User = require("./models/HospUser");
const { Hospital, Item } = require("./models/HospInven");
const HospReq = require("./models/HospReq");
const HospMData = require("./models/HospMdata");
const HospTransact = require("./models/HospTrans");
const HospServ = require("./models/HospServ");

// login api
app.get("/", (req, res) => {
  res.send("Running");
});

// add hospital
app.post("/add", async (req, res) => {
  try {
    const { name, address, email, password } = req.body;
    const hospital = new User({
      name: name,
      address: address,
      email: email,
      password: password,
    });

    await hospital.save();
    res
      .status(201)
      .json({ message: "Hospital created successfully", hospital: hospital });
  } catch (error) {
    res.status(500).json({ error: "Error creating hospital", details: error });
  }
});


// login api
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const cred = await User.findOne({ email });

    if (!cred) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (cred.password !== password) {
      res.status(401).json({ error: "Incorrect password" });
      return;
    }

    res.status(200).json({ status: "ok", message: "Login successful", cred });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// create inventory
app.post("/hospitals", async (req, res) => {
  try {
    const { name, email, inventory } = req.body;

    // Create new hospital with the provided data
    const newHospital = new Hospital({ name, email, inventory });
    await newHospital.save();

    res.json(newHospital);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// update inventory
app.post("/invup", async (req, res) => {
  try {
    // const newItemData = req.body;
    const { email, newItemData } = req.body;
    const hospital = await Hospital.findOne({ email });

    // Check if the hospital exists
    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    const existingItem = hospital.inventory.items.find(
      (item) => item.name === newItemData.name
    );

    if (existingItem) {
      // Update existing item
      existingItem.quantity = newItemData.quantity;
      existingItem.lastStockChange = newItemData.lastStockChange;
    } else {
      // Add new item to the inventory
      hospital.inventory.items.push(newItemData);
    }

    await hospital.save();
    res.json({ message: "Item added/updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// get inventory
app.post('/getinv', async (req, res) => {
  try {
    const {email} = req.body;

    const hospital = await Hospital.findOne({ email });

    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    // Return only the inventory-related information
    // const inventory = hospital.inventory.items;

    // res.json(inventory);

    const transformedInventory = hospital.inventory.items.map(item => ({
      name: [item.name, item.quantity > 100], // Assuming the condition for true/false based on quantity
      quantity: item.quantity,
      date: item.lastStockChange.toDateString() // Assuming lastStockChange is a Date object
    }));

    res.json(transformedInventory);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// add request for help 

app.post('/hospitalRequests', async (req, res) => {
  try {
    const { name , email, requests } = req.body;

    // Ensure the hospitalId is valid (you may want to do some validation here)

    const requestsArray = Array.isArray(requests) ? requests : [requests];

    const hospitalreq = new HospReq({
      name : name,
      email: email,
      requests: requestsArray,
    });
    // const newRequests = await HospitalRequirement.create(requestsArray);
      await hospitalreq.save();

      res
      .status(201)
      .json({ message: "Request created successfully" });
    // res.status(201).json(newRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// get urgent requirement

app.get('/urgentrequests', async (req, res) => {
  try {
    // Find all entries where 'urgent' field is true
    // const urgentRequests = await HospReq.find({ 'requests.urgent': true });
    const urgentRequests = await HospReq.find(
      { 'requests.urgent': true },
      'name email requests.equipment requests.quantity requests.description'
    );

    res.json(urgentRequests); // Send the urgent requests as a JSON response
  } catch (err) {
    res.status(500).json({ error: err.message }); // Handle any error that might occur
  }
});

// get rest all requirement

app.get('/getrequests', async (req, res) => {
  try {
    // Find all entries where 'urgent' field is true
    // const urgentRequests = await HospReq.find({ 'requests.urgent': true });
    const urgentRequests = await HospReq.find(
      { 'requests.urgent': false },
      'name email requests.equipment requests.quantity requests.description'
    );

    res.json(urgentRequests); // Send the urgent requests as a JSON response
  } catch (err) {
    res.status(500).json({ error: err.message }); // Handle any error that might occur
  }
});

// add hospimdata

app.post('/mdata', async (req, res) => {
  try {
    // Extract the data from the request body
    const {
      patientReferralAccepted,
      patientReferred,
      totalService,
      patientIntake,
      totalExchange,
      wallet,
      email,
    } = req.body;

    // Create a new HospitalData document
    const hospitalData = new HospMData({
      patientReferralAccepted,
      patientReferred,
      totalService,
      patientIntake,
      totalExchange,
      wallet,
      email,
    });

    // Save the new document to the database
    await hospitalData.save();

    res.status(201).json({ message: 'Hospital data added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// get hospimdata

app.post('/getmdata', async (req, res) => {
  try {
    const { email } = req.body;

    // Find hospital data by email
    const hospitalData = await HospMData.find({ email });

    if (hospitalData.length === 0) {
      res.status(404).json({ message: 'No data found for the provided email' });
    } else {
      res.json(hospitalData);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// add transaction history 

app.post('/uptrs', async (req, res) => {
  try {
    // const { hospitalName } = req.params;
    // const { hospitalName , email, requirementName, askedForRequirement, dateOfCompletion } = req.body;

    // const transaction = {
    //   requirementName,
    //   askedForRequirement,
    //   dateOfCompletion
    // };

    // const historyEntry = await HospTransact.findOneAndUpdate(
    //   { hospitalName },
    //   { email },
    //   { $push: { transactions: transaction } },
    //   { new: true, upsert: true }
    // );

    // res.status(201).json(historyEntry);

    const { hospitalName, transactions } = req.body;

    const historyEntry = await HospTransact.findOneAndUpdate(
      { hospitalName },
      { $push: { transactions: { $each: transactions } } }, // Use $each to add multiple transactions
      { new: true, upsert: true }
    );

    res.status(201).json(historyEntry);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// add hopsital in transaction table

app.post('/trs', async (req, res) => {
  try {
    // const { hospitalName } = req.params;
    const { hospitalName , email, transactions } = req.body;

    // const transaction = {
    //   requirementName,
    //   askedForRequirement,
    //   dateOfCompletion
    // };

    // const requestsArray = Array.isArray(transactions) ? transactions : [transactions];
    const htran = new HospTransact({
      hospitalName,
      email,
      transactions:transactions
    });

    await htran.save();
    res.status(201).json({ message: 'Hospital data added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get transact table for asked requirement
app.post('/getreqtran', async (req, res) => {
  const { hospitalEmail } = req.body;
  
  try {
    const transactions = await HospTransact.find({
      email: hospitalEmail,
      'transactions.askedForRequirement': true
    });

    if (transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found for the given hospital email.' });
    }

    const filteredTransactions = transactions.map(transaction => ({
      _id: transaction._id,
      hospitalName: transaction.hospitalName,
      email: transaction.email,
      transactions: transaction.transactions.filter(tr => tr.askedForRequirement === true),
      __v: transaction.__v
    }));

    res.json(filteredTransactions[0].transactions);

    // res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// get transact for given requirement
app.post('/getgtran', async (req, res) => {
  const { hospitalEmail } = req.body;
  
  try {
    const transactions = await HospTransact.find({
      email: hospitalEmail,
      'transactions.askedForRequirement': false
    });

    if (transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found for the given hospital email.' });
    }

    const filteredTransactions = transactions.map(transaction => ({
      _id: transaction._id,
      hospitalName: transaction.hospitalName,
      email: transaction.email,
      transactions: transaction.transactions.filter(tr => tr.askedForRequirement === false),
      __v: transaction.__v
    }));

    res.json(filteredTransactions[0].transactions);

    // res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// add service page
app.post('/hserv', async (req, res) => {
  try {
    const { hospitalName, email, services } = req.body;

    const newHospital = new HospServ({
      hospitalName,
      email,
      services,
    });

     await newHospital.save();
    res.status(201).json(newHospital);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// updating service 

app.post('/upserv', async (req, res) => {
  try {
    // const { email } = req.params;
    const { email,services } = req.body;

    const existingHospital = await HospServ.findOne({ email });

    if (existingHospital) {
      existingHospital.services.push(...services);
      const updatedHospital = await existingHospital.save();
      res.status(200).json(updatedHospital);
    } else {
      res.status(404).json({ message: 'Hospital not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get services for hospital

app.get('/getserv', async (req, res) => {
  try {
    const hospitals1 = await HospServ.find({}, 'hospitalName email location services');
    // const transformedData = hospitals.map(item => {
    //   return {
    //     name: [item.hospitalName, false], // Assuming the 'false' value for all items
    //     quantity: 1, // Placeholder quantity value, as it's not present in the API response
    //     date: new Date().toDateString(), // You may replace this with the relevant date
    //     progress: 0, // Placeholder progress value, as it's not present in the API response
    //   };
    // });

    const transformedData = [];

// Map through the API response to structure the data
  hospitals1.forEach(hospital => {
  hospital.services.forEach(service => {
    const hospitalService = {
      hospitalName: hospital.hospitalName,
      serviceName: service.serviceName
    };
    transformedData.push(hospitalService);
  });
});

    res.status(200).json(transformedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

server.listen(port, () => console.log(`Server is running on port ${port}`));
