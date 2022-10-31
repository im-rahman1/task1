import React, { useState, useEffect } from "react";
import "./App.css";

import {
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Checkbox,
  Button,
} from "@mui/material";

function App() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    rate: "",
    applied_to: "",
    applicable_items: [],
  });
  const [categoriesChecked, setCategoriesChecked] = useState();

  const getItems = () => {
    const arrOfItems = [];
    for (let i = 0; i < res.length; i++) {
      if (res[i].category) {
        arrOfItems.push({
          id: res[i].id,
          name: res[i].name,
          category: res[i].category.name,
        });
      } else {
        arrOfItems.push({
          id: res[i].id,
          name: res[i].name,
          category: "others",
        });
      }
    }
    setItems(arrOfItems);
  };

  const handleChange = (field, e) => {
    if (field === "applicable_items") {
      const arr = [...form.applicable_items];
      let value = e.target.value;
      if (!arr.includes(value)) {
        arr.push(value);
        setForm({ ...form, applicable_items: arr });
      } else if (arr.includes(value)) {
        const index = arr.indexOf(value);
        arr.splice(index, 1);
        setForm({ ...form, applicable_items: arr });
      }
    } else if (field === "category") {
      console.log(e.target.value);
      for (let i = 0; i < items.length; i++) {
        let itemsOfSingleCategory = [];
        if (items[i].category === e.target.value) {
          itemsOfSingleCategory.push(items[i]);
        }
      }
    }
  };

  const handleFilter = (query) => {
    if (!query) {
      getItems();
    } else {
      const filteredItems = items.filter((post) => {
        const postName = post.name.toLowerCase();
        return postName.includes(query);
      });
      setItems(filteredItems);
    }
  };

  const handleChangeRadio = (value) => {
    if (value == "all") {
      let arrOfItems = [];
      setForm({ ...form, applicable_items: [] });
      for (let i = 0; i < items.length; i++) {
        arrOfItems.push(items[i].id.toString());
      }
      setForm({
        ...form,
        applicable_items: [...arrOfItems],
        applied_to: "all",
      });
    } else if (value == "some") {
      setForm({ ...form, applied_to: value });
    }
  };

  const checkCategory = (category) => {
    let itemsOfSingleCategory = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].category === category) {
        itemsOfSingleCategory.push(items[i].id);
      }
    }

    let selectedItemsOfCategory = [];
    for (let i = 0; i < form.applicable_items.length; i++) {
      for (let j = 0; j < items.length; j++) {
        if (form.applicable_items[i] == items[j].id) {
          selectedItemsOfCategory.push(items[j].id);
        }
      }
    }

    // console.log(category);
    // // console.log(form.applicable_items);
    // console.log(itemsOfSingleCategory);
    // console.log(selectedItemsOfCategory);

    if (itemsOfSingleCategory.join() === selectedItemsOfCategory.join()) {
      // console.log(true);
      setCategoriesChecked({ ...categoriesChecked, [category]: true });
    } else {
      // console.log(false);
      setCategoriesChecked({ ...categoriesChecked, [category]: false });
    }
  };

  // useEffect(() => {
  //   if (form.applicable_items.length > 0) {
  //     checkCategory();
  //   }
  // }, [form]);

  useEffect(() => {
    let arrOfCategories = [];
    for (let i = 0; i < items.length; i++) {
      if (!arrOfCategories.includes(items[i].category)) {
        arrOfCategories.push(items[i].category);
      }
    }
    setCategories(arrOfCategories);

    for (let i = 0; i < categories.length; i++) {
      setCategoriesChecked({
        ...categoriesChecked,
        [categories[i]]: false,
      });
    }
    console.log(arrOfCategories);
  }, [items]);

  useEffect(() => {
    getItems();
  }, []);

  // console.log(items);
  // console.log(categories);
  // console.log(form);
  console.log(categoriesChecked);

  return (
    <div className="app">
      <div className="home">
        <div className="header">
          <h1>Add Tax</h1>
          <h1>X</h1>
        </div>
        <div className="form">
          <div className="form__txtFields">
            <TextField placeholder="Enter Name" size="small" />
            <TextField placeholder="Percentage" type="number" size="small" />
          </div>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="female"
            name="radio-buttons-group">
            <FormControlLabel
              value={form.applied_to}
              onChange={() => handleChangeRadio("all")}
              control={<Radio checked={form.applied_to == "all"} />}
              label="Apply to all items in collection"
            />
            <FormControlLabel
              value={form.applied_to}
              onChange={() => handleChangeRadio("some")}
              control={<Radio checked={form.applied_to == "some"} />}
              label="Apply to specific items"
            />
          </RadioGroup>
          <Divider />
          <TextField
            onChange={(e) => handleFilter(e.target.value)}
            placeholder="Search Items"
            size="small"
          />
          <div className="items">
            {categories.map((category, i) => (
              <div key={i}>
                <div id="checkbox-group" className="items__category">
                  <label className="items__category">
                    <Checkbox
                      onChange={(e) => handleChange("category", e)}
                      checked={categoriesChecked[category] || false}
                      value={category}
                    />
                    {category}
                  </label>
                </div>
                {items
                  .filter((item) => item.category === category)
                  .map((item, j) => (
                    <div
                      className="categorized__items"
                      role="group"
                      aria-labelledby="checkbox-group"
                      key={j}>
                      <label key={j}>
                        <Checkbox
                          type="checkbox"
                          name="applicable_items"
                          value={item.id.toString() || " "}
                          checked={form.applicable_items.includes(
                            item.id.toString()
                          )}
                          onChange={(e) => {
                            handleChange("applicable_items", e);
                            checkCategory(item.category);
                          }}
                        />
                        {item.name}
                      </label>
                    </div>
                  ))}
              </div>
            ))}
          </div>
          <Button
            variant="contained"
            disableElevation>{`Apply Tax To ${form.applicable_items.length} items `}</Button>
        </div>
      </div>
    </div>
  );
}

export default App;

const res = [
  {
    id: 14864,
    tab_id: 3202,
    name: "Recurring Item",
    amount: 12.0,
    amount_type: "fixed",
    allow_quantity: null,
    deleted_at: null,
    required: false,
    created_at: "2018-07-02T14:11:00.305Z",
    updated_at: "2018-06-17T19:19:42.304Z",
    type: "TabItem",
    position: 1,
    anchor: null,
    parent_id: null,
    catalog_object_id: null,
    description: null,
    available_quantity: null,
    hidden: false,
    options: {
      recurring: {
        enabled: true,
        options: {
          ends: { type: "never" },
          start: { type: "first_payment" },
          repeatInterval: "P1M",
        },
      },
    },
    tsv: "'item':2 'recur':1",
    quantity_sold: 2,
    amount_sold: 24.0,
    total_buyers: 1,
    quantity_refunded: 0,
    amount_discounted: 0.0,
    amount_refunded: 0.0,
    net_amount: 24.0,
    net_quantity: 2,
    subcategory: null,
    images: [],
  },
  {
    id: 14865,
    tab_id: 3202,
    name: "Jasinthe Bracelet",
    amount: 26.0,
    amount_type: "fixed",
    allow_quantity: null,
    deleted_at: null,
    required: false,
    created_at: "2018-07-02T14:11:00.309Z",
    updated_at: "2018-08-11T03:08:39.841Z",
    type: "TabItem",
    position: 1,
    anchor: null,
    parent_id: 14866,
    catalog_object_id: 8463,
    description: null,
    available_quantity: 8,
    hidden: false,
    options: { makeAvailableQuantityPublic: false },
    tsv: "'bracelet':2 'jasinth':1",
    quantity_sold: 11,
    amount_sold: 286.0,
    total_buyers: 7,
    quantity_refunded: 0,
    amount_discounted: 0.0,
    amount_refunded: 0.0,
    net_amount: 286.0,
    net_quantity: 11,
    subcategory: null,
    category: { id: 14866, name: "Bracelets", options: {} },
    images: [
      {
        id: 5572,
        upload_path: "uploads/image/image_file/716/jasinthe_bracelet.jpg",
        metadata: {},
        url: "https://images.cheddarcdn.com/eyJidWNrZXQiOiJjaGVkZGFyLXVwLXJldmlldyIsImtleSI6InVwbG9hZHMvaW1hZ2UvaW1hZ2VfZmlsZS83MTYvamFzaW50aGVfYnJhY2VsZXQuanBnIiwib3V0cHV0Rm9ybWF0IjoianBlZyIsImVkaXRzIjp7ImZsYXR0ZW4iOnsiYmFja2dyb3VuZCI6eyJyIjoyNTUsImciOjI1NSwiYiI6MjU1fX19fQ==",
      },
    ],
  },
  {
    id: 14867,
    tab_id: 3202,
    name: "Jasinthe Bracelet",
    amount: 26.0,
    amount_type: "fixed",
    allow_quantity: null,
    deleted_at: null,
    required: false,
    created_at: "2018-07-02T14:11:00.317Z",
    updated_at: "2018-07-10T13:24:53.733Z",
    type: "TabItem",
    position: 2,
    anchor: null,
    parent_id: 14866,
    catalog_object_id: 8463,
    description: null,
    available_quantity: 19,
    hidden: false,
    options: { makeAvailableQuantityPublic: true },
    tsv: "'bracelet':2 'jasinth':1",
    quantity_sold: 1,
    amount_sold: 26.0,
    total_buyers: 1,
    quantity_refunded: 0,
    amount_discounted: 5.2,
    amount_refunded: 0.0,
    net_amount: 20.8,
    net_quantity: 1,
    subcategory: null,
    category: { id: 14866, name: "Bracelets", options: {} },
    images: [
      {
        id: 5571,
        upload_path: "uploads/image/image_file/1742/jasinthe_bracelet.jpg",
        metadata: {},
        url: "https://images.cheddarcdn.com/eyJidWNrZXQiOiJjaGVkZGFyLXVwLXJldmlldyIsImtleSI6InVwbG9hZHMvaW1hZ2UvaW1hZ2VfZmlsZS8xNzQyL2phc2ludGhlX2JyYWNlbGV0LmpwZyIsIm91dHB1dEZvcm1hdCI6ImpwZWciLCJlZGl0cyI6eyJmbGF0dGVuIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NX19fX0=",
      },
    ],
  },
  {
    id: 14868,
    tab_id: 3202,
    name: "Recurring Item with questions",
    amount: 12.0,
    amount_type: "fixed",
    allow_quantity: null,
    deleted_at: null,
    required: false,
    created_at: "2018-07-02T14:11:00.323Z",
    updated_at: "2018-07-02T14:10:25.296Z",
    type: "TabItem",
    position: 2,
    anchor: null,
    parent_id: null,
    catalog_object_id: null,
    description: null,
    available_quantity: null,
    hidden: false,
    options: {
      recurring: {
        enabled: true,
        options: {
          ends: { type: "payment_count", payment_count: 5 },
          start: { type: "first_payment" },
          repeatInterval: "P1M",
        },
      },
      makeAvailableQuantityPublic: false,
    },
    tsv: "'item':2 'question':4 'recur':1",
    quantity_sold: 0,
    amount_sold: 0.0,
    total_buyers: 0,
    quantity_refunded: 0,
    amount_discounted: 0.0,
    amount_refunded: 0.0,
    net_amount: 0.0,
    net_quantity: 0,
    subcategory: null,
    images: [],
  },
  {
    id: 14869,
    tab_id: 3202,
    name: "Zero amount item with questions",
    amount: 0.0,
    amount_type: "fixed",
    allow_quantity: null,
    deleted_at: null,
    required: false,
    created_at: "2018-07-02T14:11:00.334Z",
    updated_at: "2018-07-02T14:09:09.267Z",
    type: "TabItem",
    position: 3,
    anchor: null,
    parent_id: null,
    catalog_object_id: null,
    description: null,
    available_quantity: null,
    hidden: false,
    options: { makeAvailableQuantityPublic: false },
    tsv: "'amount':2 'item':3 'question':5 'zero':1",
    quantity_sold: 2,
    amount_sold: 0.0,
    total_buyers: 2,
    quantity_refunded: 0,
    amount_discounted: 0.0,
    amount_refunded: 0.0,
    net_amount: 0.0,
    net_quantity: 2,
    subcategory: null,
    images: [],
  },
  {
    id: 14870,
    tab_id: 3202,
    name: "Inspire Bracelet",
    amount: 32.0,
    amount_type: "fixed",
    allow_quantity: null,
    deleted_at: null,
    required: false,
    created_at: "2018-07-02T14:11:00.348Z",
    updated_at: "2018-06-27T16:47:21.731Z",
    type: "TabItem",
    position: 3,
    anchor: null,
    parent_id: 14866,
    catalog_object_id: 8462,
    description: null,
    available_quantity: 0,
    hidden: false,
    options: {},
    tsv: "'bracelet':2 'inspir':1",
    quantity_sold: 0,
    amount_sold: 0.0,
    total_buyers: 0,
    quantity_refunded: 0,
    amount_discounted: 0.0,
    amount_refunded: 0.0,
    net_amount: 0.0,
    net_quantity: 0,
    subcategory: null,
    category: { id: 14866, name: "Bracelets", options: {} },
    images: [
      {
        id: 5570,
        upload_path: "uploads/image/image_file/715/inspire_bracelet.jpg",
        metadata: {},
        url: "https://images.cheddarcdn.com/eyJidWNrZXQiOiJjaGVkZGFyLXVwLXJldmlldyIsImtleSI6InVwbG9hZHMvaW1hZ2UvaW1hZ2VfZmlsZS83MTUvaW5zcGlyZV9icmFjZWxldC5qcGciLCJvdXRwdXRGb3JtYXQiOiJqcGVnIiwiZWRpdHMiOnsiZmxhdHRlbiI6eyJiYWNrZ3JvdW5kIjp7InIiOjI1NSwiZyI6MjU1LCJiIjoyNTV9fX19",
      },
    ],
  },
  {
    id: 14872,
    tab_id: 3202,
    name: "Normal item with questions",
    amount: 55.0,
    amount_type: "fixed",
    allow_quantity: null,
    deleted_at: null,
    required: false,
    created_at: "2018-07-02T14:11:00.365Z",
    updated_at: "2018-07-02T14:09:46.143Z",
    type: "TabItem",
    position: 4,
    anchor: null,
    parent_id: null,
    catalog_object_id: null,
    description: null,
    available_quantity: null,
    hidden: false,
    options: { makeAvailableQuantityPublic: false },
    tsv: "'item':2 'normal':1 'question':4",
    quantity_sold: 2,
    amount_sold: 110.0,
    total_buyers: 2,
    quantity_refunded: 0,
    amount_discounted: 22.0,
    amount_refunded: 0.0,
    net_amount: 88.0,
    net_quantity: 2,
    subcategory: null,
    images: [],
  },
  {
    id: 14873,
    tab_id: 3202,
    name: "normal item ",
    amount: 20.0,
    amount_type: "fixed",
    allow_quantity: null,
    deleted_at: null,
    required: false,
    created_at: "2018-07-02T14:11:00.378Z",
    updated_at: "2018-06-21T15:38:07.112Z",
    type: "TabItem",
    position: 5,
    anchor: null,
    parent_id: null,
    catalog_object_id: null,
    description: null,
    available_quantity: null,
    hidden: false,
    options: {},
    tsv: "'item':2 'normal':1",
    quantity_sold: 1,
    amount_sold: 20.0,
    total_buyers: 1,
    quantity_refunded: 0,
    amount_discounted: 4.0,
    amount_refunded: 0.0,
    net_amount: 16.0,
    net_quantity: 1,
    subcategory: null,
    images: [],
  },
];
