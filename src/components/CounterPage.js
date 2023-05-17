import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import echo from "./echo.png";

const CounterPage = () => {
	const [count, setCount] = useState(190477); // Initial value
	const animationRef = useRef();
	const countRef = useRef(count);
	const intervalRef = useRef();

	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch("http://41.191.74.42:8000/txcurr-counter/");
			const data = await response.json();
			console.log(data[0].value);
			return data[0].value;
		};

		const animate = (initVal, lastVal, duration) => {
			let startTime = null;

			const step = (currentTime) => {
				if (!startTime) {
					startTime = currentTime;
				}

				const progress = Math.min((currentTime - startTime) / duration, 1);
				countRef.current = Math.floor(progress * (lastVal - initVal) + initVal);

				if (progress < 1) {
					animationRef.current = requestAnimationFrame(step);
				} else {
					cancelAnimationFrame(animationRef.current);
				}

				setCount(countRef.current);
			};

			animationRef.current = requestAnimationFrame(step);
		};

		const load = async () => {
			const value = await fetchData();
			animate(count, value, 7000);
		};

		load();

		intervalRef.current = setInterval(() => {
			load();
		}, 3600000); // Fetch data every hour

		return () => {
			cancelAnimationFrame(animationRef.current);
			clearInterval(intervalRef.current); // Clear interval in the clean-up function
		};
	}, []);

	return (
		<div>
			<div className="text-center">
				<h1 className="fs-1 fw-bold">ECHO TX CURR Counter Page</h1>
				<h1 className="fs-1 fw-bold">
					<img src={echo} width="600" height="227" alt="" />
				</h1>
				<h2 className="fs-1 fw-bold" style={{ color: "#e32636" }}>
					Estamos alcançando nossa meta de 400,000
				</h2>
			</div>
			<div className="container" style={{ backgroundColor: "#e32636" }}>
				<div className="row d-flex align-items-center justify-content-center">
					<div className="col-sm text-center">
						<p id="0101" className="fs-2 text-light fw-bold">
							{count.toLocaleString("en-US")}
						</p>
						<p className="text-light">Pacientes em Tratamento</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CounterPage;
