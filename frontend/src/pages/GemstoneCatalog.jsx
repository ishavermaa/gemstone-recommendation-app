import { useEffect, useState } from 'react';
import GemstoneCard from '../components/GemstoneCard.jsx';
import LoadingSkeleton from '../components/LoadingSkeleton.jsx';
import { getGemstones } from '../services/gemstoneService.js';

export default function GemstoneCatalog() {
  const [filters, setFilters] = useState({ search: '', planet: '', color: '', sort: 'name' });
  const [gemstones, setGemstones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getGemstones(filters)
      .then(({ gemstones }) => setGemstones(gemstones))
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <section className="section">
      <div className="section-heading">
        <p className="eyebrow">Catalog</p>
        <h1>Gemstone library</h1>
      </div>
      <div className="filters panel">
        <input placeholder="Search by name" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        <select value={filters.planet} onChange={(e) => setFilters({ ...filters, planet: e.target.value })}>
          <option value="">All planets</option>
          {['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={filters.color} onChange={(e) => setFilters({ ...filters, color: e.target.value })}>
          <option value="">All colors</option>
          {['Red', 'Green', 'Yellow', 'White', 'Blue'].map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
          <option value="name">A to Z</option>
          <option value="nameDesc">Z to A</option>
        </select>
      </div>
      {loading ? <LoadingSkeleton count={6} /> : <div className="grid cards">{gemstones.map((gemstone) => <GemstoneCard gemstone={gemstone} key={gemstone._id} />)}</div>}
    </section>
  );
}
