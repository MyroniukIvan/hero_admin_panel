import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import { useHttp } from '../../hooks/http.hook';
import {
	filtersFetching,
	filtersFetched,
	filtersFetchingError,
	activeFilterChanged,
} from '../../actions';
import Spinner from "../spinner/Spinner";

const HeroesFilters = () => {
	const { filters, filtersLoadingStatus, activeFilter } = useSelector(
		(state) => state.filters
	);
	const dispatch = useDispatch();
	const { request } = useHttp();

	useEffect(() => {
		dispatch(filtersFetching());
		request('http://localhost:3001/filters')
			.then((data) => dispatch(filtersFetched(data)))
			.catch((error) => dispatch(filtersFetchingError(error)));
	}, []);

	if (filtersLoadingStatus === 'loading') {
		return <Spinner />;
	} else if (filtersLoadingStatus === 'error') {
		return <h5 className="text-center mt-5">Ошибка загрузки</h5>;
	}

	const renderFilters = (arr) => {
		if (arr.length === 0) {
			return <h5 className="text-center mt-5">Фильтры не найдены</h5>;
		}

		return arr.map(({ name, className, label }) => {
			const btnClass = classNames('btn', className, {
				active: name === activeFilter,
			});

			return (
				<button
					key={name}
					id={name}
					className={btnClass}
					onClick={() => dispatch(activeFilterChanged(name))}
				>
					{label}
				</button>
			);
		});
	};

	const elements = renderFilters(filters);

	return (
		<div className="card shadow-lg mt-4">
			<div className="card-body">
				<p className="card-text">Отфильтруйте героев по элементам</p>
				<div className="btn-group">{elements}</div>
			</div>
		</div>
	);
};

export default HeroesFilters;