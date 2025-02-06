const Button = ({ onClick, children }) => (
	<button className="btn" onClick={onClick}>
		{children}
	</button>
);

export default Button;
