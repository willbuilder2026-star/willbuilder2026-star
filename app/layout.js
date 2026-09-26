export const metadata = {
  title: "Draft My Will",
  description: "Will Builder — real account test build",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, sans-serif",
          background: "#faf7f1",
          color: "#1c2b3a",
          minHeight: "100vh",
        }}
      >
        {children}
      </body>
    </html>
  );
}
