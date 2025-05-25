# MongoDB Installation Guide for Windows (TailAPI)

This guide walks you through installing **MongoDB Community Edition** on your Windows development machine. It's tailored for setting up TailAPI.

---

## ✅ Step 1: Download MongoDB

1. Visit the official MongoDB download page:
   👉 [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)

2. Select:

   - **Version**: Latest stable (e.g., 6.0+)
   - **OS**: Windows
   - **Package**: MSI

3. Click **Download**.

---

## ✅ Step 2: Install MongoDB

1. Run the downloaded `.msi` installer.

2. Choose the **Complete** installation type.

3. Make sure the following options are selected:

   - ✔️ _Install MongoDB as a Service_
   - ✔️ _Run service as Network Service user_
   - ✔️ _Install MongoDB Compass_ (optional for GUI)

4. Finish the setup.

---

## ✅ Step 3: Add MongoDB to System PATH (Optional if already done)

1. Open **Start** → search for **Environment Variables** → open it.
2. In **System variables**, find `Path` → click **Edit**.
3. Ensure this is listed (or add it):

   ```
   C:\Program Files\MongoDB\Server\<your_version>\bin
   ```

---

## ✅ Step 4: Start MongoDB Service

MongoDB should run automatically as a service.

To verify:

```sh
services.msc
```

Look for `MongoDB Server`. It should be **Running**.

Or start it manually:

```sh
net start MongoDB
```

---

## ✅ Step 5: Test with Shell

Open a terminal and run:

```sh
mongosh
```

You should see:

```
test>
```

This means MongoDB is working locally.

---

## ✅ Step 6: Connect TailAPI

When you run the TailAPI app with the following connection string:

```ts
mongoose.connect("mongodb://localhost:27017/tailapi");
```

You should see:

```
✅ Connected to MongoDB
```

Access the API:

```
http://localhost:3001/api/sessions
```

---

Let me know if you'd like to add an index setup or validation script for Mongo collections!
