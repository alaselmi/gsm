import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRepairCache } from "../context/RepairCacheContext";

import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Select from "../components/ui/Select";

const TECHNICIANS = ["Ali Ben", "Sami Trabelsi", "Youssef Hamdi"];

export default function CreateRepair() {
  const { addRepair } = useRepairCache();
  const navigate = useNavigate();

  const [form, setForm] = useState({});

  const submit = (e) => {
    e.preventDefault();
    addRepair(form);
    navigate("/repairs");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-indigo-600">
          New Repair
        </h1>
        <p className="text-gray-500 text-sm">
          Create a new repair request
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={submit}
        className="bg-white/80 backdrop-blur-lg border border-indigo-100 p-6 rounded-2xl space-y-4"
      >

        <Input
          label="Client"
          placeholder="Client name"
          color="indigo"
          onChange={(e) =>
            setForm({ ...form, client: e.target.value })
          }
        />

        <Input
          label="Phone"
          placeholder="Phone number"
          color="sky"
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <Input
          label="Device"
          placeholder="Device"
          color="purple"
          onChange={(e) =>
            setForm({ ...form, device: e.target.value })
          }
        />

        <Select
          label="Technician"
          options={TECHNICIANS}
          onChange={(e) =>
            setForm({ ...form, technician: e.target.value })
          }
        />

        <Input
          label="Price"
          type="number"
          placeholder="0"
          color="amber"
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />

        <Button variant="primary">
          Create Repair
        </Button>

      </form>
    </div>
  );
}