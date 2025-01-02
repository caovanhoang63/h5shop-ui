import React, { ChangeEvent, useMemo, useState } from "react";
import { Search, Plus, User, X } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { listCustomer } from "@/pages/sale/api/customerApi.ts";
import { Customer } from "@/types/customer/customer.ts";
import { CustomerListFilter } from "@/types/customer/customerListFilter.ts";
import _ from "lodash";

interface CustomerSearchProps {
  onSelectCustomer: (customer: Customer | undefined) => void;
}

export const CustomerSearch: React.FC<CustomerSearchProps> = ({
  onSelectCustomer,
}) => {
  const [searchCustomer, setSearchCustomer] = useState("");
  const [searchCustomerResult, setSearchCustomerResult] =
    useState<Customer[]>();
  const [selectedCustomer, setSelectedCustomer] = useState<
    Customer | undefined
  >();

  const debounceSearchCustomer = useMemo(
    () =>
      _.debounce(async (query: string) => {
        if (query.trim() === "") {
          setSearchCustomerResult(undefined);
        } else {
          const filter: CustomerListFilter = {
            lkPhoneNumber: query,
            status: [1],
          };
          listCustomer(filter)
            .then((response) => {
              const searchResponse = response.data;
              setSearchCustomerResult(searchResponse);
            })
            .catch((error) => {
              console.error(error);
            });
        }
      }, 500),
    [],
  );

  const handleSearchCustomer = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchCustomer(query);
    debounceSearchCustomer(query);
  };

  return (
    <div className="relative w-full p-2 flex items-center">
      {selectedCustomer ? (
        <Button className="h-9 w-full justify-start bg-gray-200 text-primary hover:bg-gray-200 shadow-none">
          <User />
          {selectedCustomer.phoneNumber +
            " - " +
            selectedCustomer.lastName +
            " " +
            selectedCustomer.firstName}
          <Button
            onClick={() => {
              setSelectedCustomer(undefined);
              onSelectCustomer(undefined);
            }}
            className="p-1 ml-auto h-6 w-6 bg-transparent text-black hover:bg-gray-300 rounded-full shadow-none"
          >
            <X />
          </Button>
        </Button>
      ) : (
        <div className="w-full relative flex items-center">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transform bg-background" />
          <Input
            value={searchCustomer}
            onChange={handleSearchCustomer}
            className="pl-9 bg-background flex-grow"
            placeholder="Tìm khách hàng"
          />
          <Button className="absolute right-3 p-1 h-7 w-7 bg-background text-gray-600 hover:bg-gray-200 rounded-full shadow-none">
            <Plus />
          </Button>
        </div>
      )}
      {searchCustomerResult && searchCustomer.trim() !== "" && (
        <div className="absolute top-full mt-2 left-0 w-full bg-white border rounded-lg shadow-md z-50 max-h-60 overflow-y-auto">
          {searchCustomerResult.map((customer) => (
            <div
              key={customer.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSelectedCustomer(customer);
                onSelectCustomer(customer);
                setSearchCustomer("");
                setSearchCustomerResult(undefined);
              }}
            >
              <span className="text-gray-500">{customer.phoneNumber}</span> -{" "}
              <span className="font-medium">
                {customer.lastName} {customer.firstName}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
