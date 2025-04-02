

function Footer() {
  return (
    <div className="bg-gray-900 text-white py-8 px-4">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()}  All rights reserved.</p>
      </div>
    </div>
  );
}

export default Footer;