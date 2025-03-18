import { useLocation } from "react-router";

type Params = {
    link: string;
  };

const ChatPDF = () => {
    const location = useLocation();
    const values = location.state as Params;

  return (
    <div>
      <h1>User url: {values.link}</h1>
      <embed
      src={values.link}
      type="application/pdf"
      width="100%"
      height="600px"
    />
    </div>
  );
};

export default ChatPDF;