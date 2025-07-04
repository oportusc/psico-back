# 🧪 COMPLETE TEST: Email + Google Meet

## **Previous Configuration**

### 1. **Add to `.env`:**
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
```

### 2. **Restart server:**
```bash
yarn start:dev
```

---

## **🔹 Step 1: Create Test User**

```graphql
mutation {
  createUser(createUserInput: {
    rut: "12.345.678-9"
    firstName: "María"
    lastName: "González López"
    email: "your-personal-email@gmail.com"  # 👈 Your email to receive test
    phone: "+56912345678"
    address: "Av. Principal 123"
  }) {
    id
    firstName
    lastName
    email
    rut
  }
}
```

**Expected response:**
```json
{
  "data": {
    "createUser": {
      "id": "generated-uuid",
      "firstName": "María",
      "lastName": "González López",
      "email": "your-personal-email@gmail.com",
      "rut": "12.345.678-9"
    }
  }
}
```

---

## **🔹 Step 2A: IN-PERSON Appointment (Without Google Meet)**

```graphql
mutation {
  createAppointment(createAppointmentInput: {
    date: "2024-12-25"
    time: "10:00"
    type: IN_PERSON
    reason: "Initial psychological evaluation appointment"
    userId: "REPLACE_WITH_USER_ID"
  }) {
    id
    date
    time
    type
    reason
    googleEventId
    googleMeetLink
    user {
      id
      firstName
      lastName
      email
    }
  }
}
```

**Expected response:**
```json
{
  "data": {
    "createAppointment": {
      "id": "appointment-uuid",
      "date": "2024-12-25T00:00:00.000Z",
      "time": "10:00",
      "type": "IN_PERSON",
      "reason": "Initial psychological evaluation appointment",
      "googleEventId": "calendar-event-id",
      "googleMeetLink": null,  // 👈 NULL because it's in-person
      "user": {
        "id": "user-uuid",
        "firstName": "María",
        "lastName": "González López",
        "email": "your-personal-email@gmail.com"
      }
    }
  }
}
```

### **Verifications:**
- ✅ **Google Calendar**: Event appears without Google Meet
- ✅ **Email**: Sent without videoconference section
- ✅ **Database**: `googleMeetLink` = null

---

## **🔹 Step 2B: ONLINE Appointment (With Google Meet)**

```graphql
mutation {
  createAppointment(createAppointmentInput: {
    date: "2024-12-26"
    time: "14:00"
    type: ONLINE
    reason: "Online therapeutic follow-up session"
    userId: "REPLACE_WITH_USER_ID"
  }) {
    id
    date
    time
    type
    reason
    googleEventId
    googleMeetLink
    user {
      id
      firstName
      lastName
      email
    }
  }
}
```

**Expected response:**
```json
{
  "data": {
    "createAppointment": {
      "id": "online-appointment-uuid",
      "date": "2024-12-26T00:00:00.000Z",
      "time": "14:00",
      "type": "ONLINE",
      "reason": "Online therapeutic follow-up session",
      "googleEventId": "online-calendar-event-id",
      "googleMeetLink": "https://meet.google.com/abc-defg-hij",  // 👈 GENERATED LINK
      "user": {
        "id": "user-uuid",
        "firstName": "María",
        "lastName": "González López",
        "email": "your-personal-email@gmail.com"
      }
    }
  }
}
```

### **Verifications:**
- ✅ **Google Calendar**: Event appears **WITH** "Join with Google Meet" button
- ✅ **Email**: Sent **WITH** videoconference section and Meet button
- ✅ **Database**: `googleMeetLink` = Valid Meet URL

---

## **🔹 Step 3: Verify All Appointments**

```graphql
query {
  appointments {
    id
    date
    time
    type
    reason
    googleEventId
    googleMeetLink
    user {
      firstName
      lastName
      email
    }
  }
}
```

**Expected response:**
```json
{
  "data": {
    "appointments": [
      {
        "id": "in-person-uuid",
        "date": "2024-12-25T00:00:00.000Z",
        "time": "10:00",
        "type": "IN_PERSON",
        "reason": "Initial psychological evaluation appointment",
        "googleEventId": "calendar-event-id",
        "googleMeetLink": null,
        "user": {
          "firstName": "María",
          "lastName": "González López",
          "email": "your-personal-email@gmail.com"
        }
      },
      {
        "id": "online-uuid",
        "date": "2024-12-26T00:00:00.000Z",
        "time": "14:00",
        "type": "ONLINE",
        "reason": "Online therapeutic follow-up session",
        "googleEventId": "online-calendar-event-id",
        "googleMeetLink": "https://meet.google.com/abc-defg-hij",
        "user": {
          "firstName": "María",
          "lastName": "González López",
          "email": "your-personal-email@gmail.com"
        }
      }
    ]
  }
}
```

---

## **🔹 Step 4: Test Email Functionality**

### **Check Your Email Inbox:**

1. **First Email (IN-PERSON):**
   - ✅ **Subject**: "✅ Psychological Appointment Confirmation - Wednesday, December 25, 2024"
   - ✅ **Content**: Shows appointment details WITHOUT Google Meet section
   - ✅ **Calendar links**: Google Calendar and Outlook buttons
   - ✅ **Instructions**: Physical arrival instructions

2. **Second Email (ONLINE):**
   - ✅ **Subject**: "✅ Psychological Appointment Confirmation - Thursday, December 26, 2024"
   - ✅ **Content**: Shows appointment details WITH Google Meet section
   - ✅ **Meet Button**: Blue button "📹 Join Google Meet"
   - ✅ **Calendar links**: Google Calendar and Outlook buttons
   - ✅ **Instructions**: Online connection instructions

---

## **🔹 Step 5: Test Google Calendar Integration**

### **Check Your Google Calendar:**

1. **Event 1 (IN-PERSON)**:
   - ✅ **Title**: "Psychological Appointment"
   - ✅ **Date**: December 25, 2024
   - ✅ **Time**: 10:00 - 10:50
   - ✅ **Description**: Contains reason
   - ✅ **No Google Meet**: No meeting link in the event

2. **Event 2 (ONLINE)**:
   - ✅ **Title**: "Psychological Appointment (Online)"
   - ✅ **Date**: December 26, 2024
   - ✅ **Time**: 14:00 - 14:50
   - ✅ **Description**: Contains reason + Meet link
   - ✅ **Google Meet**: "Join with Google Meet" button visible

---

## **🔹 Step 6: Test Additional Operations**

### **6.1 Confirm Appointment**
```graphql
mutation {
  confirmAppointment(id: "APPOINTMENT_ID_HERE") {
    id
    confirmed
  }
}
```

### **6.2 Cancel Appointment**
```graphql
mutation {
  cancelAppointment(id: "APPOINTMENT_ID_HERE") {
    id
    cancelled
  }
}
```

### **6.3 Update Appointment**
```graphql
mutation {
  updateAppointment(
    id: "APPOINTMENT_ID_HERE"
    updateAppointmentInput: {
      time: "15:30"
      reason: "Updated reason for appointment"
    }
  ) {
    id
    date
    time
    type
    reason
  }
}
```

### **6.4 Get User Appointments**
```graphql
query {
  appointmentsByUser(userId: "USER_ID_HERE") {
    id
    date
    time
    type
    reason
    confirmed
    cancelled
  }
}
```

### **6.5 Get Upcoming Appointments**
```graphql
query {
  upcomingAppointments {
    id
    date
    time
    type
    reason
    user {
      firstName
      lastName
      email
    }
  }
}
```

---

## **🔹 Expected Success Indicators**

### **✅ Database (PostgreSQL)**
- `appointments` table has records with correct data
- `googleMeetLink` field is NULL for IN_PERSON
- `googleMeetLink` field has valid URL for ONLINE
- `googleEventId` field has Google Calendar event ID

### **✅ Email Service**
- Emails sent to user's email address
- Different content based on appointment type
- Calendar links work correctly
- Meet button works for ONLINE appointments

### **✅ Google Calendar**
- Events created in psychologist's calendar
- Meet links generated only for ONLINE appointments
- Event descriptions contain appointment details
- Times are correct (50-minute duration)

### **✅ API Responses**
- GraphQL queries return correct data
- Mutations update database correctly
- Error handling works properly
- Field validation works as expected

---

## **🔹 Troubleshooting**

### **Problem: No email received**
- Check EMAIL_USER and EMAIL_PASSWORD in .env
- Verify Gmail App Password is correct
- Check spam folder
- Verify email service is initialized

### **Problem: Google Meet link not generated**
- Check Google Calendar API credentials
- Verify service account permissions
- Check if appointment type is ONLINE
- Review server logs for API errors

### **Problem: Calendar event not created**
- Check Google Calendar API credentials
- Verify calendar ID is correct
- Check service account permissions
- Review API quotas and limits

### **Problem: GraphQL errors**
- Check schema.gql is up to date
- Verify entity relationships
- Check required fields are provided
- Review server logs for detailed errors

---

## **🔹 Advanced Tests**

### **Test 1: Multiple Appointments Same Day**
```graphql
# Create multiple appointments for same user, same day
mutation {
  createAppointment(createAppointmentInput: {
    date: "2024-12-25"
    time: "09:00"
    type: ONLINE
    reason: "Morning session"
    userId: "USER_ID_HERE"
  }) { id }
}

mutation {
  createAppointment(createAppointmentInput: {
    date: "2024-12-25"
    time: "16:00"
    type: IN_PERSON
    reason: "Afternoon session"
    userId: "USER_ID_HERE"
  }) { id }
}
```

### **Test 2: Bulk Operations**
```graphql
# Test getting all appointments
query {
  appointments {
    id
    date
    time
    type
    reason
    googleEventId
    googleMeetLink
    user {
      firstName
      lastName
      email
    }
  }
}
```

### **Test 3: Date Filtering**
```graphql
# Test future appointments
query {
  upcomingAppointments {
    id
    date
    time
    type
    reason
  }
}

# Test past appointments
query {
  pastAppointments {
    id
    date
    time
    type
    reason
  }
}
```

This comprehensive test ensures all functionality works correctly with the new English field names and entity structure. 