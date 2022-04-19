import React from "react";

enum MonitorStatusBackgroundColors {
  Run = "#00af4e",
  Stop = "#fe0201",
  Downtime = "#fcc002",
  Disconnect = "#222529",
}

enum MonitorStatusBorderColors {
  Run = "#6ad198",
  Stop = "#fe9292",
  Downtime = "#fee491",
  Disconnect = "#1a1d21",
}

interface IFrameStyle {
  width: string;
  backgroundColor: string;
  border: string;
}

interface IHeaderStyle {
  display: string;
  justifyContent: string;
  height: string;
}

interface ITitleStyle {
  fontSize: string;
  marginLeft: string;
  marginTop: string;
}

interface IBodyStyle {
  display: string;
  justifyContent: string;
}

interface IContentStyle {
  display: string;
  justifyContent: string;
  alignItems: string;
  width: string;
  height: string;
  border: string;
  borderRadius: string;
  backgroundColor: string;
  color: string;
}

interface IFooterStyle {
  height: string;
  display: string;
  justifyContent: string;
  alignItems: string;
}

interface ICardStyle {
  frame: IFrameStyle;
  header: IHeaderStyle;
  title: ITitleStyle;
  body: IBodyStyle;
  content: IContentStyle;
  footer: IFooterStyle;
}

export interface IMonitorProps {
  title: string;
  content: string;
  footer: string;
  status: string;
}

const MonitorCard: React.FC<IMonitorProps> = (props) => {
  const cardStyle: ICardStyle = {
    frame: {
      width: "300px",
      backgroundColor: "#ffffff",
      border: "none",
    },
    header: {
      display: "flex",
      justifyContent: "flex-start",
      height: "60px",
    },
    title: {
      fontSize: "15px",
      marginLeft: "15px",
      marginTop: "20px",
    },
    body: {
      display: "flex",
      justifyContent: "space-around",
    },
    content: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "70px",
      height: "70px",
      border: `1px solid ${MonitorStatusBorderColors[props.status]}`,
      borderRadius: "50%",
      backgroundColor: `${MonitorStatusBackgroundColors[props.status]}`,
      color: "#ffffff",
    },
    footer: {
      height: "70px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  };

  return (
    <div style={cardStyle.frame}>
      <div style={cardStyle.header}>
        <span style={cardStyle.title}>{props.title}</span>
      </div>
      <div style={cardStyle.body}>
        <div style={cardStyle.content}>{props.content}</div>
      </div>
      <div style={cardStyle.footer}>
        <span>{props.footer}</span>
      </div>
    </div>
  );
};

export default MonitorCard;
