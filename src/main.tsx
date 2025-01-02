import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { BrowserRouter, Routes, Route } from "react-router";
import ConnectionsApp from "./connections/ConnectionsApp.tsx";

Amplify.configure(outputs);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/connections" element={<ConnectionsApp />} />
        <Route path="/" element={<Authenticator formFields={{
          signUp: {
            displayName: {
              label: 'Display Name',
              isRequired: true,

            }
          }
        }}>
          {({ signOut, user, }) => (
            <main>
              <button onClick={signOut}>Sign out</button>
              <App />
            </main>
          )}
        </Authenticator>}
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
